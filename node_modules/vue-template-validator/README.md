# vue-template-validator

> Catch common syntax errors in Vue.js templates at compile time.

``` js
var validate = require('vue-template-validator')

var warnings = validate(str)

warnings.forEach(function (msg) {
  console.log(msg)
})
```
