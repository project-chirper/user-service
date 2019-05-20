const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      crypto = require('crypto'),
      jwt = require('jsonwebtoken'),
      secret = process.env.SECRET

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required'],
    minlength: [5, 'Username must be at least 5 characters'],
    maxlength: [25, 'Username must be no more than 25 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username is invalid'],
    unique: true
  },
  email: {
    address: {
      type: String,
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
      unique: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  profile: {
    bio: {
      type: String,
      default: 'I am boring and have no bio :)',
      maxlength: [150, 'Bio must be no more than 150 characters']
    },
    website: {
      type: String,
      maxlength: [150, 'Website URL must be no more than 150 characters']
    }
  },

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  followerCount: {
    type: Number,
    default: 0
  },

  // Password
  hash: String,
  salt: String
}, {
  collection: 'users'
})

UserSchema.plugin(uniqueValidator, { message: '{VALUE} is already taken' })

/**
 * @desc Compares plain text password against password hash
 * @return If valid, true otherwise false.
 */
UserSchema.methods.validPassword = function(password) {
  return this.hash === crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

/**
 * @desc Encrypts plain text password with salt
 * @return Saves salt and hash
 */
UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

/**
 * @desc Generates a JWT tailored for the user
 * @return Signed JWT expiring in 60 days
 */
UserSchema.methods.generateJWT = function() {
  let today = new Date()
  let exp = new Date()

  exp.setDate(today.getDate()+60)

  return jwt.sign({
    id: this._id,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}

/**
 * @desc Transforms basic user data into JSON
 * @return JSON user data including JWT
 */
UserSchema.methods.toAuthJSON = async function() {
  let publicData = await this.publicData({ viewer: false })
  let privateData = {
    email: this.email.address,
    token: this.generateJWT(),
  }
  return { ...publicData, ...privateData }
}

/**
 * @desc Returns only public data
 * @param viewer Viewers ID
 * @return JSON public user data
 */
UserSchema.methods.publicData = async function({ viewer }) {
  // Fetch viewer
  viewer = viewer ? await User.findById(viewer, 'following') : false

  return {
    id: this._id,
    username: this.username,
    profile: this.profile,
    followerCount: this.followerCount,
    followingCount: this.following ? this.following.length : undefined,
    isFollowed: viewer ? viewer.following.indexOf(this._id) >= 0 : false,
    followsYou: viewer && this.following ? this.following.indexOf(viewer._id) >= 0 : false, 
    dateCreated: this.dateCreated
  }
}

mongoose.model('User', UserSchema)
const User = mongoose.model('User')