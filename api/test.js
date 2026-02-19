const moment = require('moment')

module.exports = (req, res) => {
  const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a')
  res.end(`currentTime: ${currentTime}, version: 6, log: added stiftung warentest, nbr, website, removed old sz, blz downstreams`)
}
