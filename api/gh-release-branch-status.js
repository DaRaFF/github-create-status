#!/usr/bin/env node

const _ = require('lodash')
const assert = require('assert')
const conventionalCommits = require('semantic-release-conventional-commits')
const {isValidSha} = require('../lib/validation')
const isReleaseBranch = require('../lib/is_release_branch')
const mapRepository = require('../lib/map_repository')
const getPullBySha = require('../lib/git/get_pull_by_sha')
const getPull = require('../lib/git/get_pull')
const getCommitByPull = require('../lib/git/get_commit_by_pull')
const createCommitStatus = require('../lib/git/create_commit_status')

assert(process.env.GITHUB_TOKEN, 'missing environment variable GITHUB_TOKEN e.g 11b22b33n4')
const token = process.env.GITHUB_TOKEN

const commitConfig = {
  minorTypes: ['feat', 'feature'],
  patchTypes: ['fix', 'docs', 'refactor', 'style', 'test', 'chore']
}

// main application
module.exports = async (req, res) => {
  console.log('Semantic Release API called with:', req.method, req.url, req.body)

  try {
    await run(req, res)
  } catch (error) {
    console.error('Semantic Release API Error:', error)
    return res.status(400).json({error: error.message})
  }
}

async function run(req, res) {
  let state
  const sha = req.body.sha
  const originalRepository = req.body.repository
  const repository = mapRepository(originalRepository)

  console.log(
    `Processing request for repository: ${repository}, original repository: ${originalRepository}, sha: ${sha}`
  )

  if (!isValidSha(sha, res)) return

  const pullRequests = await getPullBySha({repository, token, sha})

  const pullRequestNumber = _.get(pullRequests, '[0].number', false)

  if (!pullRequestNumber) {
    console.log(`No pull request found for SHA '${sha}' in repository '${repository}'`)
    return res.status(401).json({message: `no pull request found with commit ${sha} `})
  }

  const pr = await getPull({repository, token, pull_number: pullRequestNumber})

  const baseBranchName = _.get(pr, 'base.ref', false)
  const pullRequestUrl = _.get(pr, 'html_url', false)

  if (isReleaseBranch(baseBranchName)) {
    const prComments = await getCommitByPull({repository, token, pull_number: pullRequestNumber})
    const commits = _.map(prComments, (c) => c.commit)

    const type = await conventionalCommits(commitConfig, {commits})

    if (type !== 'patch') {
      state = 'error'
    } else {
      state = 'success'
    }
  } else {
    state = 'no-release-branch'
  }

  await createCommitStatus({repository, token, sha, state})
  console.log(`GitHub check updated with status '${state}' on pull request ${pullRequestUrl} .`)
  res.status(200).json({
    message: `GitHub check updated with status '${state}' on pull request ${pullRequestUrl} .`
  })
}
