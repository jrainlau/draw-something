var chalk = require('chalk')

/**
 * Transform raw warning messages into codeframe output.
 */

module.exports = function (msg, source, line, col) {
  var output = '\n'
  var carret = '    | ' + pad(col - 1) + chalk.yellow('^')
  if (line != null && col != null) {
    var lines = source.split(/\r?\n/g)
    if (lines.length === 1) {
      lines = [formatLine(lines[0], 1, true), carret]
    } else if (lines.length === 2) {
      lines = lines.map(function (l, i) {
        return formatLine(l, i + 1, i + 1 === line)
      })
      lines.splice(line, 0, carret)
    } else {
      lines = lines.slice(line - 2, line + 1).map(function (l, i) {
        return formatLine(l, line - 1 + i, i === 1)
      })
      // add carret
      lines.splice(2, 0, carret)
    }
    output += chalk.gray(lines.join('\n'))
  }
  return output + chalk.red('\n\n  ' + msg + '\n')
}

function formatLine (lineText, lineNumber, isCurrent) {
  if (isCurrent) lineText = chalk.yellow(lineText)
  return '  ' +lineNumber + ' | ' + lineText
}

function pad (n) {
  var res = ''
  while (n--) {
    res += ' '
  }
  return res
}
