// require parse5 now to avoid slowing down test
require('parse5')
var chalk = require('chalk')
var validate = require('../index')
var expect = require('chai').expect

describe('vue-template-validator', function () {

  it('self-closing tag', function () {
    var code =
      '<div>\n' +
      '  <test/>\n' +
      '</div>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(1)
    var msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Invalid self-closing tag: <test/>')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <test/>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </div>')

    code =
      '<div>\n' +
      '  <test/></test>\n' +
      '</div>'
    warnings = validate(code)
    expect(warnings.length).to.equal(1)
    msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Invalid self-closing tag: <test/>')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <test/></test>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </div>')
  })

  it('camelCase tag', function () {
    var code =
      '<div>\n' +
      '  <HelloWorld></HelloWorld>\n' +
      '</div>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(1)
    var msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Found camelCase tag: <HelloWorld>')
    expect(msg).to.contain('Use <hello-world> instead')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <HelloWorld></HelloWorld>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </div>')
  })

  it('camelCase attr', function () {
    var code =
      '<div>\n' +
      '  <test myProp="123"></test></div>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(1)
    var msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Found camelCase attribute: myProp="123"')
    expect(msg).to.contain('Use my-prop="123" instead')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <test myProp="123"></test></div>')
    expect(msg).to.contain('  |         ^')
  })

  it('multiple warnings', function () {
    var code =
      '<div>\n' +
      '  <HelloWorld myProp="123"/>\n' +
      '</div>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(3)
    var msg
    // 1
    msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Invalid self-closing tag: <HelloWorld myProp="123"/>')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <HelloWorld myProp="123"/>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </div>')

    // 2
    msg = chalk.stripColor(warnings[1])
    expect(msg).to.contain('Found camelCase tag: <HelloWorld>')
    expect(msg).to.contain('Use <hello-world> instead')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <HelloWorld myProp="123"/>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </div>')

    // 3
    var msg = chalk.stripColor(warnings[2])
    expect(msg).to.contain('Found camelCase attribute: myProp="123"')
    expect(msg).to.contain('Use my-prop="123" instead')
    expect(msg).to.contain('1 | <div>')
    expect(msg).to.contain('2 |   <HelloWorld myProp="123"/>')
    expect(msg).to.contain('  |               ^')
    expect(msg).to.contain('3 | </div>')
  })

  it('table', function () {
    var warnings = validate('<table><tr><slot></slot></tr></table>')
    expect(warnings.length).to.equal(1)
    var msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Tag <slot> cannot appear inside <table>')
    expect(msg).to.contain('1 | <table><tr><slot></slot></tr></table>')
    expect(msg).to.contain('  |            ^')
  })

  it('svg valid tags', function() {
    var code =
      '<svg>\n' +
      '  <linearGradient></linearGradient>\n' +
      '  <clipPath></clipPath>\n' +
      '</svg>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(0)
    var msg
    // linearGradient
    msg = chalk.stripColor(warnings[0])
    expect(msg).to.not.exist

    // clipPath
    msg = chalk.stripColor(warnings[1])
    expect(msg).to.not.exist
  })

  it('svg invalid tag', function() {
    var code =
      '<svg>\n' +
      '  <fooBar></fooBar>\n' +
      '</svg>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(1)
    var msg = chalk.stripColor(warnings[0])
    expect(msg).to.contain('Found camelCase tag: <fooBar>')
    expect(msg).to.contain('Use <foo-bar> instead')
    expect(msg).to.contain('1 | <svg>')
    expect(msg).to.contain('2 |   <fooBar></fooBar>')
    expect(msg).to.contain('  |   ^')
    expect(msg).to.contain('3 | </svg>')
  })

  it('svg camelCase attrs', function () {
    var code = '<svg viewBox="x"><image preserveAspectRatio="x"></svg>'
    var warnings = validate(code)
    expect(warnings.length).to.equal(0)
  })
})
