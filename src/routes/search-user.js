const User = require('mongoose').model('User')

/**
 * @desc Searches users by username and returns basic data
 * @param username The username to search by (likeness)
 * @param amount The amount of users to return each page (limit)
 * @param offset Current page (skip = amount*offset)
 */
module.exports = async (req, res) => {
  // Validate username query

  if (!req.query.username) return res.sendStatus(404)

  // Normalize options
  let options = {
    amount: req.query.amount ? parseInt(req.query.amount) : 25, // Default 25
    offset: req.query.offset ? parseInt(req.query.offset) : 0 // Default 0
  }
  // Validate options
  if (options.amount <= 0 || options.amount > 25 || options.offset < 0) return res.sendStatus(422) // Unprocessable entity

  let users = await User.find({ username: { $regex: new RegExp(req.query.username, "i") } }, { 
      score: { $meta: 'textScore' },
      username: true
    })
    .skip(options.offset * options.amount)
    .limit(options.amount)
    .sort({ score: { $meta: 'textScore' }})

  return res.json({
    count: users.length,
    users
  })
}