var getTag = require('../get-tag')
var hyphenateRE = require('../hyphenate').hyphenateRE
var hyphenate = require('../hyphenate').hyphenate

module.exports = function (node, source, warn) {
  if (
    node.tagName &&
    node.__location &&
    node.__location.startTag
  ) {
    var startTag = getTag(node, source)

    if (node.tagName === startTag.slice(1,-1)) {
      return
    }

    if (hyphenateRE.test(startTag)) {
      warn(
        'Found camelCase tag: ' + startTag + '. ' +
        'HTML is case-insensitive. ' +
        'Use ' + hyphenate(startTag) + ' instead. ' +
        'Vue will automatically match it against components ' +
        'defined with camelCase ids in JavaScript.',
        source,
        node.__location.startTag.line,
        node.__location.startTag.col
      )
    }
  }
}
