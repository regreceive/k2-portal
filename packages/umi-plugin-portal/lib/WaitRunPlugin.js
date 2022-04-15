"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = _interopRequireDefault(require("webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

class WaitRunWebpackPlugin {
  constructor(options) {
    this.options = void 0;
    this.options = options;

    if (typeof options.test !== 'object') {
      throw new TypeError('Argument must be an RegExp.');
    }
  }

  wrapContent(assets) {
    let ret = [];
    Object.keys(assets).some(key => {
      var _this$options$test;

      if ((_this$options$test = this.options.test) === null || _this$options$test === void 0 ? void 0 : _this$options$test.test(key)) {
        // SVGElement 为了兼容jointjs
        ret = [key, `(function () {
          var run = function (window, document, self, SVGElement) {
            ${assets[key].source()}
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent('bundleReady', false, false, {run: run});
          window.dispatchEvent(evt);
        })();`];
        return true;
      }

      return false;
    });
    return ret;
  }

  apply(compiler) {
    if (_webpack().default.version.startsWith('4.')) {
      compiler.hooks.emit.tap('WaitRunWebpackPlugin', compilation => {
        const values = this.wrapContent(compilation.assets);

        if (values.length > 0) {
          compilation.assets[values[0]].source = () => {
            return values[1];
          };

          compilation.assets[values[0]].size = () => values[1].length;
        }
      });
      return;
    } // 适配webpack5


    const chunkNameMatcher = this.options.test;
    compiler.hooks.compilation.tap('WaitRunWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'WaitRunWebpackPlugin',
        // https://webpack.docschina.org/api/compilation-hooks/#list-of-asset-processing-stages
        stage: _webpack().default.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
      }, () => {
        var _iterator = _createForOfIteratorHelper(compilation.chunks),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            const chunk = _step.value;

            if (chunk.canBeInitial()) {
              var _iterator2 = _createForOfIteratorHelper(chunk.files),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  const file = _step2.value;

                  if (chunkNameMatcher.test(file)) {
                    compilation.updateAsset(file, old => {
                      // SVGElement 为了兼容jointjs
                      return new (_webpack().default.sources.ConcatSource)(`(function () {
                        var run = function (window, document, self, SVGElement) {\n`, old, `\n };
                        var evt = document.createEvent('CustomEvent');
                        evt.initCustomEvent('bundleReady', false, false, {run: run});
                        window.dispatchEvent(evt);
                      })();`);
                    });
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    });
  }

}

var _default = WaitRunWebpackPlugin;
exports.default = _default;