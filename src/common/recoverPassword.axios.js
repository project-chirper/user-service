const axios = require('axios')

module.exports = ({ username, email, uniqueCode }) => {
  return axios({
    url: 'http://mailer-service:3004/mailer/recover-password',
    method: 'post',
    data: {
      username,
      email,
      uniqueCode
    }
  })
}