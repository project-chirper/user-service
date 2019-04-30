const User = require('mongoose').model('User')

module.exports = async (req, res, next) => {
  // Prevent user from following themself
  if (req.user == req.targetUser._id) return res.sendStatus(401)

  // Find user
  let user = await User.findById(req.user)
  
  // Determine if user is following targetUser or not
  let isFollowing = user.following.indexOf(req.targetUser._id)

  // If following remove else add
  if (isFollowing > -1) { // is following
    user.following.splice(isFollowing, 1)
    req.targetUser.followerCount--
  } else {
    user.following.push(req.targetUser._id)
    req.targetUser.followerCount++
  }

  try {
    user.save()
    req.targetUser.save()
  } catch(err) {
    next(err)
  }

  return res.sendStatus(200)
}