// some repositories send a different name from GitHub
// but we want to have the correct GitHub repository name as callback
// this maps them to the correct value for GitHub API calls
const repositoryMap = {
  nrk: 'livingdocs-nrk',
  stiftung: 'livingdocs-stiftung-warentest'
}

module.exports = function mapRepository(repository) {
  return repositoryMap[repository] ?? repository
}
