const router = require('express').Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User')

// Preload User on routes with :user_id param
router.param('user_id', async (req, res, next, userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return res.sendStatus(404) // Invalid user ID
  req.targetUser = await User.findById(userId)
  if (!req.targetUser) return res.sendStatus(404) // User not found 404
  next()
})

router.get('/auth', require('./auth')) // auth checking
router.post('/register', require('./register')) // register
router.post('/login', require('./login')) // login

router.get('/:user_id', (req, res) => res.json(req.targetUser.publicData())) // fetch user's public data

module.exports = router