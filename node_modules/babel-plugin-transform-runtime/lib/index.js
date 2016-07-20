/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.definitions = undefined;

exports.default = function ( /*istanbul ignore next*/_ref) {
  /*istanbul ignore next*/var t = _ref.types;

  var RUNTIME_MODULE_NAME = "babel-runtime";

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  var HELPER_BLACKLIST = ["interopRequireWildcard", "interopRequireDefault"];

  return { /*istanbul ignore next*/
    pre: function pre(file) {
      file.set("helperGenerator", function (name) {
        if (HELPER_BLACKLIST.indexOf(name) < 0) {
          return file.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/helpers/" + name, "default", name);
        }
      });

      this.setDynamic("regeneratorIdentifier", function () {
        return file.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/regenerator", "default", "regeneratorRuntime");
      });
    },


    visitor: { /*istanbul ignore next*/
      ReferencedIdentifier: function ReferencedIdentifier(path, state) {
        /*istanbul ignore next*/var node = path.node;
        /*istanbul ignore next*/var parent = path.parent;
        /*istanbul ignore next*/var scope = path.scope;


        if (node.name === "regeneratorRuntime" && state.opts.regenerator !== false) {
          path.replaceWith(state.get("regeneratorIdentifier"));
          return;
        }

        if (state.opts.polyfill === false) return;

        if (t.isMemberExpression(parent)) return;
        if (!has( /*istanbul ignore next*/_definitions2.default.builtins, node.name)) return;
        if (scope.getBindingIdentifier(node.name)) return;

        // Symbol() -> _core.Symbol(); new Promise -> new _core.Promise
        path.replaceWith(state.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/core-js/" + /*istanbul ignore next*/_definitions2.default.builtins[node.name], "default", node.name));
      },
      /*istanbul ignore next*/

      // arr[Symbol.iterator]() -> _core.$for.getIterator(arr)
      CallExpression: function CallExpression(path, state) {
        if (state.opts.polyfill === false) return;

        // we can't compile this
        if (path.node.arguments.length) return;

        var callee = path.node.callee;
        if (!t.isMemberExpression(callee)) return;
        if (!callee.computed) return;
        if (!path.get("callee.property").matchesPattern("Symbol.iterator")) return;

        path.replaceWith(t.callExpression(state.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/core-js/get-iterator", "default", "getIterator"), [callee.object]));
      },
      /*istanbul ignore next*/

      // Symbol.iterator in arr -> core.$for.isIterable(arr)
      BinaryExpression: function BinaryExpression(path, state) {
        if (state.opts.polyfill === false) return;

        if (path.node.operator !== "in") return;
        if (!path.get("left").matchesPattern("Symbol.iterator")) return;

        path.replaceWith(t.callExpression(state.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/core-js/is-iterable", "default", "isIterable"), [path.node.right]));
      },


      // Array.from -> _core.Array.from
      MemberExpression: { /*istanbul ignore next*/
        enter: function enter(path, state) {
          if (state.opts.polyfill === false) return;
          if (!path.isReferenced()) return;

          /*istanbul ignore next*/var node = path.node;

          var obj = node.object;
          var prop = node.property;

          if (!t.isReferenced(obj, node)) return;
          if (node.computed) return;
          if (!has( /*istanbul ignore next*/_definitions2.default.methods, obj.name)) return;

          var methods = /*istanbul ignore next*/_definitions2.default.methods[obj.name];
          if (!has(methods, prop.name)) return;

          // doesn't reference the global
          if (path.scope.getBindingIdentifier(obj.name)) return;

          // special case Object.defineProperty to not use core-js when using string keys
          if (obj.name === "Object" && prop.name === "defineProperty" && path.parentPath.isCallExpression()) {
            var call = path.parentPath.node;
            if (call.arguments.length === 3 && t.isLiteral(call.arguments[1])) return;
          }

          path.replaceWith(state.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/core-js/" + methods[prop.name], "default", /*istanbul ignore next*/obj.name + "$" + prop.name));
        },
        /*istanbul ignore next*/exit: function exit(path, state) {
          if (state.opts.polyfill === false) return;
          if (!path.isReferenced()) return;

          /*istanbul ignore next*/var node = path.node;

          var obj = node.object;

          if (!has( /*istanbul ignore next*/_definitions2.default.builtins, obj.name)) return;
          if (path.scope.getBindingIdentifier(obj.name)) return;

          path.replaceWith(t.memberExpression(state.addImport( /*istanbul ignore next*/RUNTIME_MODULE_NAME + "/core-js/" + /*istanbul ignore next*/_definitions2.default.builtins[obj.name], "default", obj.name), node.property, node.computed));
        }
      }
    }
  };
};

var /*istanbul ignore next*/_definitions = require("./definitions");

/*istanbul ignore next*/
var _definitions2 = _interopRequireDefault(_definitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.definitions = _definitions2.default;