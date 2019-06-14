const User = require('mongoose').model('User')

/**
 * @desc Updates users dispay info
 */
module.exports = async (req, res) => {
  // Find user
  let user = await User.findById(req.user)
  if (!user) return res.sendStatus(404) // Send 404 if not found

  // Combine user.profile and req.body (updated fields)
  user.profile = {
    ...user.profile,
    ...req.body
  }

  try {
    await user.save()
  } catch (err) {
    // Validation errors -> return error message array
    return res.status(422).json({
      errors: Object.values(err.errors).map(x => x.message)
    });
  }

  // All good, send 200
  return res.sendStatus(200)
}