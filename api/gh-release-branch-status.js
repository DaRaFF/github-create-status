#!/usr/bin/env node

const _ = require('lodash')
const assert = require('assert')
const {json, send} = require('micro')
const conventionalCommits = require('semantic-release-conventional-commits')
const {isValidSha, isValidRepository} = require('../lib/validation')
const OctokitHelper = require('../lib/octokit_helper')

assert(process.env.GH_TOKEN, 'missing environment variable GH_TOKEN e.g 11b22b33n4')
const token = process.env.GH_TOKEN

const isReleaseBranch = (name) => {
  // release-2018-09
  if (RegExp(`^release-([0-9]{4})-(0[1-9]|1[0-2])$`, 'gi')
    .test(name)) return true
  // release-v.45.2.x
  if (RegExp(`^release-v?([0-9]{1,3}).([0-9]{1,3}).x$`, 'gi')
    .test(name)) return true
  return false
}

const commitConfig = {
  minorTypes: ['feat', 'feature'],
  patchTypes: ['fix', 'docs', 'refactor', 'style', 'test', 'chore']
}

// main application
module.exports = async (req, res) => {
  let state
  const o = new OctokitHelper(token)
  const js = await json(req)
  const {repository, sha} = js

  if (!isValidRepository(repository, res)) return
  if (!isValidSha(sha, res)) return

  const pullRequests = await o.searchPullRequest({repository, sha})
    .catch((e) => {
      return send(res, 400, e)
    })
  const pullRequestNumber = _.get(pullRequests, 'data.items[0].number', false)

  if (!pullRequestNumber) {
    return send(res, 401, `no pull request found with commit ${sha} `)
  }

  const pr = await o.getPullRequest({repository, number: pullRequestNumber})
    .catch((e) => {
      return send(res, 400, e)
    })

  const baseBranchName = pr.data.base.ref

  if (isReleaseBranch(baseBranchName)) {
    const prComments = await o.getPullRequestCommits({repository, number: pullRequestNumber})
      .catch((e) => {
        return send(res, 400, e)
      })
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

  await o.createStatus({repository, sha, state})
    .catch((e) => {
      return send(res, 400, `failed to update github check on pr ${pr.data.html_url} `)
    })
  return send(res, 200, `github check updated on pr ${pr.data.html_url} . cya l8er`)
}
