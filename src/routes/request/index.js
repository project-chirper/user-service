const router = require('express').Router(),
      auth = require('chirper-auth-middleware')

router.get('/email-verification', auth({ required: true }), require('./email-verification'))
router.post('/recover-password', require('./recover-password'))

module.exports = router