const mongoose = require('mongoose'),
      User = mongoose.model('User')

/**
 * @desc Middleware that loads a user document using :user_id param on routes
 * @param user_id id of user
 * @return req.targetUser -> User document
 */
module.exports = (select) => {
  return async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) return res.sendStatus(404)
    req.targetUser = await User.findById(req.params.user_id, select)
    if (!req.targetUser) return res.sendStatus(404) // User not found 404
    next()
  }
}