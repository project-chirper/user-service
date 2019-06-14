const User = require('mongoose').model('User'),
      verifyEmail =  require('../../common/verifyEmail.axios')

/**
 * @desc Sends user a verification email
 */
module.exports = async (req, res) => {
  let user = await User.findById(req.user, 'username email.address uniqueCode')
  user.newUniqueCode() // Create a new unique code

  await user.save()
  await verifyEmail({
    username: user.username,
    email: user.email.address,
    uniqueCode: user.uniqueCode
  })
  return res.sendStatus(200)
}