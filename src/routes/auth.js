const jwt = require('jsonwebtoken'),
      secret = process.env.SECRET

/**
 * @desc Validates authenticity of JWT
 * @return True if valid, false if not
 */
module.exports = (req, res) => {
  let token = req.headers['x-access-token'] // Extract token
  if (token) {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) return res.sendStatus(401) // Send 401 if invalid
      else return res.send(decoded.id).end() // Else send User ID from decoded JWT
    })
  } else {
    return res.sendStatus(401) // Unauthorized, no token
  }
}