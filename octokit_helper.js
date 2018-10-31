const octokit = require('@octokit/rest')()
const allowedRepositories = require('./allowed_repositories')
const states = {
  'error': 'only patch version commits are allowed in release branches',
  'failure': 'failure',
  'pending': 'pending',
  'success': 'success'
}

module.exports = class OctokitHelper {

  constructor (token) {
    octokit.authenticate({
      type: 'oauth',
      token: token
    })
  }


  async createStatus ({repository, sha, state}) {
    return await octokit.repos.createStatus({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      sha: sha,
      state: state, // error, failure, pending, success
      description: states[state],
      context: 'Semantic Release'
    })
  }

  async getPullRequest ({repository, number}) {
    return await octokit.pullRequests.get({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      number: number
    })
  }

  async getAllPullRequest ({repository, number}) {
    return await octokit.pullRequests.getAll({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      state: 'open',
      head: 'user:branch-name'
    })
  }

  async getCommit ({repository, sha}) {
    return await octokit.gitdata.getCommit({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      commit_sha: sha
    })
  }

  async searchPullRequest ({repository, sha}) {
    const owner = allowedRepositories[repository].repoOwner
    const repo = allowedRepositories[repository].repo
    return await octokit.search.issues({
      q: `${sha} repo:${owner}/${repo}`
    })
  }

  async getPullRequestCommits ({repository, number}) {
    return await octokit.pullRequests.getCommits({
      owner: allowedRepositories[repository].repoOwner,
      repo: allowedRepositories[repository].repo,
      number: number
    })
  }
}
