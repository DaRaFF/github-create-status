const moment = require('moment')

module.exports = (req, res) => {
  const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a')
  res.end(
    `currentTime: ${currentTime}, version: 3, log: add dfv repository to allowed_repositories.js`
  )
}
