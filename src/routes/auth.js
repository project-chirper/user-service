const jwt = require('jsonwebtoken'),
      secret = process.env.SECRET,
      User = require('mongoose').model('User')

/**
 * @desc Validates authenticity of JWT
 * @return True if valid, false if not
 */
module.exports = (req, res) => {
  let token = req.headers['x-access-token'] // Extract token
  if (token) {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err || await !User.findById(decoded.id)) return res.sendStatus(401) // Send 401 if invalid, or user not found
      else return res.send(decoded.id).end() // Else send User ID from decoded JWT
    })
  } else {
    return res.sendStatus(401) // Unauthorized, no token
  }
}