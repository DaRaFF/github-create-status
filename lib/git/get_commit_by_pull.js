const allowedRepositories = require('../allowed_repositories')
const request = require('request-promise')


// https://docs.github.com/en/free-pro-team@latest/rest/reference/pulls#list-commits-on-a-pull-request
module.exports = async ({repository, token, pull_number}) => {
  try {
    const owner = allowedRepositories[repository].repoOwner
    const repo = allowedRepositories[repository].repo
    return await request({
      uri: `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/commits`,
      qs: { page: 1, per_page: 100 },
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
