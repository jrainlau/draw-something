var getTag = require('../get-tag')

module.exports = function (node, source, warn, index) {
  if (
    node.tagName === 'table' &&
    node.__location &&
    node.parentNode && index > 0
  ) {
    var prev = node.parentNode.childNodes[index - 1]
    if (prev.tagName && prev.__location) {
      if (prev.__location.startOffset > node.__location.startOffset) {
        // we've found an element thrown out of place!
        warn(
          'Tag ' + getTag(prev, source) + ' cannot appear inside <table> ' +
          'due to HTML content restrictions. It will be hoisted out of <table> ' +
          'by the browser.',
          source,
          prev.__location.line,
          prev.__location.col
        )
      }
    }
  }
}
