exports.hyphenateRE = /[a-z\d][A-Z]/

var replaceRE = /([a-z\d])([A-Z])/g
exports.hyphenate = function (str) {
  return str
    .replace(replaceRE, '$1-$2')
    .toLowerCase()
}
