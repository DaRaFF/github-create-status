var request = require('request-promise')
const allowedRepositories = require('../allowed_repositories')
const states = {
  'error': {
    ghState: 'error',
    description: 'only patch commits allowed'
  },
  'success': {
    ghState: 'success',
    description: 'success - commits are valid'
  },
  'no-release-branch': {
    ghState: 'success',
    description: 'success - no release branch'
  }
}

// https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-commit-status
module.exports = async ({repository, token, sha, state}) => {
  try {
    const owner = allowedRepositories[repository].repoOwner
    const repo = allowedRepositories[repository].repo
    return request({
      method: 'POST',
      uri: `https://api.github.com/repos/${owner}/${repo}/statuses/${sha}`,
      body: {
        state: states[state].ghState, // error, failure, pending, success
        description: states[state].description,
        context: 'Semantic Release'
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise',
      },
      json: true
    })
  } catch (error) {
    throw error
  }
}
