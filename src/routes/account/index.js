const router = require('express').Router(),
      auth = require('chirper-auth-middleware')

// Edit display info
router.put('/display-info', auth({ required: true }), require('./display-info'))

// Verify email
router.get('/verify-email/:uniqueCode', require('./verify-email'))

// Reset password
router.post('/recover-password', require('./recover-password'))

module.exports = router