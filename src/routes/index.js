const router = require('express').Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User'),
      auth = require('auth-middleware'),
      loadUser = require('../common/loadUser')

router.get('/auth', require('./auth')) // auth checking
router.post('/register', require('./register')) // register
router.post('/login', require('./login')) // login

router.get('/:user_id', loadUser(), (req, res) => res.json(req.targetUser.publicData())) // fetch user's public data
router.put('/:user_id/follow', loadUser('followerCount'), auth({ required: true }), require('./follow')) // follow a user

module.exports = router