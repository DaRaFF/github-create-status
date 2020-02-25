module.exports = function isReleaseBranch (name) {
  // release-2018-09
  if (RegExp(`^release-([0-9]{4})-(0[1-9]|1[0-2])$`, 'gi')
    .test(name)) return true
  // release-2018-09-24
  // release-2018-09-xx
  if (RegExp(`^release-([0-9]{4})-(0[1-9]|1[0-2])-([0-9]|xx){1,2}$`, 'gi')
  .test(name)) return true
  // release-2018-09-kw24
  if (RegExp(`^release-[0-9]{4}-[0-9a-z]{4}$`, 'gi')
  .test(name)) return true
  // release-v45.2.x
  if (RegExp(`^release-v?([0-9]{1,3}).([0-9]{1,3}).x$`, 'gi')
    .test(name)) return true
  return false
}