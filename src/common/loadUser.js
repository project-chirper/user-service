const mongoose = require('mongoose'),
      User = mongoose.model('User')

/**
 * @desc Middleware that loads a user document using :user_id param on routes
 * @param user_id id of user
 * @return req.targetUser -> User document
 */
module.exports = (select) => {
  return async (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.user_id) && /[a-f0-9]{24}/i.test(req.params.user_id)) {
      req.targetUser = await User.findById(req.params.user_id, select ? select : req.query.select)
    } else {
      req.targetUser = await User.findOne({ username: req.params.user_id }, select ? select : req.query.select)
    }
    if (!req.targetUser) return res.sendStatus(404) // User not found 404
    next()
  }
}