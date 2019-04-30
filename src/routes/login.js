const User = require('mongoose').model('User')

// Object that gets returned when user fails authorization
const noAuthResponse = { errors: ['Incorrect username or password'] }

/**
 * @derc Logs a user in
 * @param { username, password }
 */
module.exports = async (req, res, next) => {
  // Validate inputs -> send error array
  if (!req.body.username || !req.body.password) return res.status(422).json({ errors: req.valid.errorMessages })
  // Find user
  let user = await User.findOne({ username: req.body.username })
  if (!user) return res.status(422).json(noAuthResponse) // User doesn't exist
  // Validate users password
  return user.validPassword(req.body.password) ?
         res.json(user.toAuthJSON()) : // Send basic auth json data if valid
         res.status(422).json(noAuthResponse) // Else return no auth
}