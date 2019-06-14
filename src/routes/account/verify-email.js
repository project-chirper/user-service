const User = require('mongoose').model('User')

/**
 * @desc Verifies a user's email by checking uniqueCode
 * @param uniqueCode
 */
module.exports = async (req, res) => {
  if (!req.params.uniqueCode) return res.sendStatus(401)

  // Find user with uniqueCode
  let user = await User.findOne({ uniqueCode: req.params.uniqueCode }, 'email')
  if (!user) return res.sendStatus(401) // If user isn't found, return 401
  
  // Set user to verify
  user.email.verified = true
  await user.save()
  return res.sendStatus(200)
}