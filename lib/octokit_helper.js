const octokit = require('@octokit/rest')()
const allowedRepositories = require('./allowed_repositories')
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

const OctokitHelper = class OctokitHelper {

  constructor (token) {
    octokit.authenticate({
      type: 'oauth',
      token: token
    })
  }

  async createStatus ({repository, sha, state}) {
    return octokit.repos.createStatus({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      sha: sha,
      state: states[state].ghState, // error, failure, pending, success
      description: states[state].description,
      context: 'Semantic Release'
    })
  }

  async getPullRequest ({repository, number}) {
    return octokit.pullRequests.get({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      number: number
    })
  }

  async searchPullRequest ({repository, sha}) {
    const owner = allowedRepositories[repository].repoOwner
    const repo = allowedRepositories[repository].repo
    return octokit.search.issues({
      q: `${sha} repo:${owner}/${repo}`
    })
  }

  async getPullRequestCommits ({repository, number}) {
    return octokit.pullRequests.getCommits({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      number: number
    })
  }
}

module.exports = {
  OctokitHelper,
  _octokit: octokit
}
