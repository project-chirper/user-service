const User = require('mongoose').model('User')

/**
 * @desc Takes a new password and sets it to the user
 * @param uniqueCode
 * @param password
 * @
 */
module.exports = async (req, res) => {
  if (!req.body.uniqueCode) return res.sendStatus(401)

  // Find user with uniqueCode
  let user = await User.findOne({ uniqueCode: req.body.uniqueCode }, 'hash salt')
  if (!user) return res.sendStatus(401)

  user.setPassword(req.body.password)
  await user.save()
  return res.sendStatus(200)
}