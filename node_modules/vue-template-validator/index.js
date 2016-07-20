var rules = require('./lib/rules')
var codeframe = require('./lib/codeframe')

module.exports = function (node, source) {
  if (typeof node === 'string') {
    source = node
    node = parse(node)
  }
  var warnings = []
  var warn = function () {
    warnings.push(codeframe.apply(null, arguments))
  }
  node.childNodes.forEach(function (node, index) {
    validate(node, source, warn, index)
  })
  return warnings
}

function validate (node, source, warn, index) {
  rules.forEach(function (rule) {
    rule(node, source, warn, index)
  })
  if (node.childNodes) {
    node.childNodes.forEach(function (node, index) {
      validate(node, source, warn, index)
    })
  }
}

function parse (str) {
  return require('parse5').parseFragment(str, { locationInfo: true })
}
