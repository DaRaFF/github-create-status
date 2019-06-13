const octokit = require('../lib/octokit_helper')._octokit
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
const micro = require('micro')
const listen = require('test-listen')
const request = require('request-promise')
const statusEndpoint = require('../api/gh-release-branch-status')

describe('Array', function () {

  beforeEach(async function () {
    // setup http server
    this.service = micro(statusEndpoint)

    // setup stubs
    this.authenticateStub = sinon.stub(octokit, 'authenticate')
    this.searchStub = sinon.stub(octokit.search, 'issues').callsFake(() => {
      return {data: {items: [{number: 42}]}}
    })
    this.pullRequestStub = sinon.stub(octokit.pullRequests, 'get').callsFake(() => {
      return {data: {base: {ref: 'hello'}, html_url: 'http://link-to-pr.io'}}
    })
    this.createStatusStub = sinon.stub(octokit.repos, 'createStatus')
  })

  afterEach(function () {
    // close http server
    this.service.close()

    // restore stubs
    this.authenticateStub.restore()
    this.searchStub.restore()
    this.pullRequestStub.restore()
    this.createStatusStub.restore()
  })

  it('my endpoint', async function () {
    // preparation
    const url = await listen(this.service)
    const options = {
      method: 'POST',
      uri: url,
      body: {
        repository: 'livingdocs-editor',
        sha: '1234'
      },
      json: true
    }
    const body = await request(options)

    // response
    expect('github check updated on pr http://link-to-pr.io .').to.equal(body)

    // status call
    const status = this.createStatusStub.getCall(0).args[0]
    expect({
      owner: 'livingdocsIO',
      repo: 'livingdocs-editor',
      sha: '1234',
      state: 'success',
      description: 'success - no release branch',
      context: 'Semantic Release'}).to.deep.equal(status)
  })
})
