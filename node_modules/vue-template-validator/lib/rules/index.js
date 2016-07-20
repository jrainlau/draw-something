var version
try {
  var version = require('vue').version.split('.').map(function (n) {
    return Number(n)
  })
} catch (e) {}

// camel case rules are only needed for Vue <= 1.0.16
var camelCaseRules = [
  require('./camel-case-tag'),
  require('./camel-case-attr')
]

var rules = [
  require('./self-closing-tag'),
  require('./table')
]

module.exports = (
  version &&
  version[0] >= 1 &&
  version[1] >= 0 &&
  version[2] >= 17
) ? rules : rules.concat(camelCaseRules)
