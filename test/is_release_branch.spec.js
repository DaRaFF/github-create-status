const chai = require('chai')
const expect = chai.expect

const isReleaseBranch = require('../lib/is_release_branch')

describe('isReleaseBranch()', function () {

  it('release-2018-09 is a release branch', async function () {
    expect(isReleaseBranch('release-2018-09')).to.equal(true)
  })

  it('release-2018-09-28 is a release branch', async function () {
    expect(isReleaseBranch('release-2018-09-28')).to.equal(true)
  })

  it('release-2018-09-xx is a release branch', async function () {
    expect(isReleaseBranch('release-2018-09-xx')).to.equal(true)
  })

  it('release-2018-kw43 is a release branch', async function () {
    expect(isReleaseBranch('release-2018-kw43')).to.equal(true)
  })

  it('release-v45.2.x is a release branch', async function () {
    expect(isReleaseBranch('release-v45.2.x')).to.equal(true)
  })

  it('any-branch is not release branch', async function () {
    expect(isReleaseBranch('any-branch')).to.equal(false)
  })
})
