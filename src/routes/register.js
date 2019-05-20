const User = require('mongoose').model('User')

/**
 * @desc Registers a user
 * @param { username, email, password }
 */
module.exports = async (req, res) => {
  // Return error message if no password is present
  if (!req.body.password) return res.status(422).json({ errors: ['A password is required'] })

  // Create new user
  let user = new User({
    username: req.body.username,
    email: {
      address: req.body.email
    }
  })

  // Encrypt password and save hash&salt on user
  user.setPassword(req.body.password)

  try {
    await user.save()
  } catch(err) {
    // Validation errors -> return error message array
    return res.status(422).json({
      errors: Object.values(err.errors).map(x => x.message)
    });
  }
  
  return res.json(await user.toAuthJSON()) // Return basic user data JSON including JWT
}