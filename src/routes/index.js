const router = require('express').Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      auth = require('chirper-auth-middleware'),
      loadUser = require('../common/loadUser')

router.get('/auth', require('./auth')) // auth checking
router.post('/register', require('./register')) // register
router.post('/login', require('./login')) // login

// load user data
router.get('/', auth({ required: true }), async (req, res) => {
  console.log(req.user)

  let user = await User.findById(req.user)
  if(!user) return res.sendStatus(404)
  return res.json(user.toAuthJSON())
})

router.get('/:user_id', auth({ required: false }), loadUser(), async (req, res) => res.json(await req.targetUser.publicData({ viewer: req.user }))) // fetch user's public data
router.put('/:user_id/follow', auth({ required: true }), loadUser('followerCount'), require('./follow')) // follow a user

router.get('/:user_id/following', loadUser('following'), (req, res) => res.json(req.targetUser.following)) // gets list of users user is following
router.get('/:user_id/following/:other_user', loadUser('following'), (req, res) => res.json(req.targetUser.following.indexOf(req.params.other_user) >= 0)) // whether target user is following other user

module.exports = router