var getTag = require('../get-tag')
var hyphenateRE = require('../hyphenate').hyphenateRE
var hyphenate = require('../hyphenate').hyphenate

module.exports = function (node, source, warn) {
  if (!node.__location || !node.__location.attrs) {
    return
  }
  var rawTag = getTag(node, source, true) // raw
  if (hyphenateRE.test(rawTag)) {
    node.attrs.forEach(function (attr) {
      var name = attr.name
      // if the parsed attr still has camelCase name, then
      // it is a valid camelCase attribute, e.g. on SVG elements
      // see vue-loader#127
      if (hyphenateRE.test(name)) {
        return
      }
      var loc = node.__location.attrs[name]
      if (!loc) {
        // #130 - bug in parse5 < 2.1.1
        return
      }
      var rawAttr = source.slice(loc.startOffset, loc.endOffset)
      var split = rawAttr.split('=')
      var rawName = split[0].trim()
      if (hyphenateRE.test(rawName)) {
        var hyphenated = hyphenate(rawName) + '=' + split[1]
        warn(
          'Found camelCase attribute: ' + rawAttr + '. ' +
          'HTML is case-insensitive. Use ' + hyphenated + ' instead. ' +
          'Vue will automatically interpret it as camelCase in JavaScript. ' +
          'If this is an SVG camelCase attribute, use the .camel modifier.',
          source,
          loc.line,
          loc.col
        )
      }
    })
  }
}
