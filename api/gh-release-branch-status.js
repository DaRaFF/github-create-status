#!/usr/bin/env node

const _ = require('lodash')
const assert = require('assert')
const conventionalCommits = require('semantic-release-conventional-commits')
const {isValidSha, isValidRepository} = require('../lib/validation')
const OctokitHelper = require('../lib/octokit_helper').OctokitHelper
const isReleaseBranch = require('../lib/is_release_branch')

assert(process.env.GITHUB_TOKEN, 'missing environment variable GITHUB_TOKEN e.g 11b22b33n4')
const token = process.env.GITHUB_TOKEN

const commitConfig = {
  minorTypes: ['feat', 'feature'],
  patchTypes: ['fix', 'docs', 'refactor', 'style', 'test', 'chore']
}

// main application
module.exports = async (req, res) => {
  try {
    await run(req, res)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

async function run (req, res) {
  let state
  const o = new OctokitHelper(token)
  const {repository, sha} = req.body

  if (!isValidRepository(repository, res)) return
  if (!isValidSha(sha, res)) return

  const pullRequests = await o.searchPullRequest({repository, sha})
  const pullRequestNumber = _.get(pullRequests, 'data.items[0].number', false)

  if (!pullRequestNumber) {
    return res.status(401).json({message: `no pull request found with commit ${sha} `})
  }

  const pr = await o.getPullRequest({repository, number: pullRequestNumber})

  const baseBranchName = _.get(pr, 'data.base.ref', false)
  const pullRequestUrl = _.get(pr, 'data.html_url', false)

  if (isReleaseBranch(baseBranchName)) {
    const prComments = await o.getPullRequestCommits({repository, number: pullRequestNumber})
    const commits = _.map(prComments.data, (c) => c.commit)

    const type = await conventionalCommits(commitConfig, {commits})

    if (type !== 'patch') {
      state = 'error'
    } else {
      state = 'success'
    }
  } else {
    state = 'no-release-branch'
  }

  try {
    await o.createStatus({repository, sha, state})
  } catch (e) {
    return res.status(400).json({message: `failed to update github status '${state}' on pull request ${pullRequestUrl}`})
  }
  return res.status(200).json({message: `github check updated with status '${state}' on pull request ${pullRequestUrl} .`})
}
