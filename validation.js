const _ = require('lodash')
const {send} = require('micro')
const allowedRepositories = require('./allowed_repositories')

const isValidPullRequestNumber = (number, res) => {
  if (_.isEmpty(number)) {
    const data = {
      error: "POST payload parameter 'pullRequestNumber' must be a number"
    }
    send(res, 400, data)
    return false
  }
  return true
}

const isValidSha = (sha, res) => {
  if (_.isEmpty(sha)) {
    const data = {
      error: "POST payload parameter 'sha' must be a string, e.g. 7h3eedss3"
    }
    send(res, 400, data)
    return false
  }
  return true
}

const isValidRepository = (repository, res) => {
  if (!allowedRepositories[repository]) {
    const data = {
      error: `POST payload parameter 'repository' does not allow ${repository}`,
      repositories: _.keys(allowedRepositories)
    }
    send(res, 400, data)
    return false
  }
  return true
}

module.exports = {
  isValidPullRequestNumber,
  isValidRepository,
  isValidSha
}
