const _ = require('lodash')

const isValidPullRequestNumber = (number, res) => {
  if (_.isEmpty(number)) {
    const data = {
      error: "POST payload parameter 'pullRequestNumber' must be a number"
    }
    send(res, 400, data)
    res.status(400).json(data)
    return false
  }
  return true
}

const isValidSha = (sha, res) => {
  if (_.isEmpty(sha)) {
    const data = {
      error: "POST payload parameter 'sha' must be a string, e.g. 7h3eedss3"
    }
    console.log(`SHA '${sha}' is not valid`)
    res.status(400).json(data)
    return false
  }
  return true
}

module.exports = {
  isValidPullRequestNumber,
  isValidSha
}
