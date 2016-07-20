module.exports = function (node, source, raw) {
  var loc = node.__location.startTag || node.__location
  if (raw) {
    return node.__vue_raw_tag || (
      node.__vue_raw_tag = source.slice(loc.startOffset, loc.endOffset)
    )
  } else {
    return node.__vue_tag || (
      node.__vue_tag = source.slice(
        loc.startOffset,
        loc.startOffset + node.tagName.length + 1
      ) + '>'
    )
  }
}
