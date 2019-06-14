const User = require('mongoose').model('User'),
      recoverPassword = require('../../common/recoverPassword.axios')

/**
 * @desc Sends user an email with a password recovery link
 * @param Email the users email
 */
module.exports = async (req, res) => {
  if (!req.body.email || !(/\S+@\S+\.\S+/.test(req.body.email))) return res.sendStatus(422) // Invalid

  // Check if a user has the email
  let user = await User.findOne({ 'email.address': req.body.email }, 'username email.address uniqueCode')
  if (!user) return res.sendStatus(422) // Invalid

  // generate new unique code
  user.newUniqueCode()
  await user.save()

  await recoverPassword({
    username: user.username,
    email: user.email.address,
    uniqueCode: user.uniqueCode
  })

  return res.sendStatus(200)
}