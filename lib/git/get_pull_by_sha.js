const request = require('request-promise')

// https://docs.github.com/en/rest/reference/repos#list-pull-requests-associated-with-a-commit
module.exports = async ({repository, token, sha}) => {
  try {
    return await request({
      uri: `https://api.github.com/repos/livingdocsIO/${repository}/commits/${sha}/pulls`,
      headers: {
        Accept: 'application/vnd.github.groot-preview+json',
        Authorization: `token ${token}`,
        'User-Agent': 'Request-Promise'
      },
      json: true
    })
  } catch (error) {
    throw error
  }
}
