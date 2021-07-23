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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WaitRunPlugin {
  constructor(options) {
    this.options = void 0;
    this.options = options;

    if (typeof options.test !== 'object') {
      throw new TypeError('Argument must be an RegExp.');
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tap('wait-run-plugin', Compilation => {
      const options = this.options;
      return new Promise((resolve, reject) => {
        const assets = Compilation.assets;
        Object.keys(assets).forEach(key => {
          var _options$test;

          if ((_options$test = options.test) === null || _options$test === void 0 ? void 0 : _options$test.test(key)) {
            const wrapper = `(function () {
              var run = function (document) {
              ${assets[key].source()}
              };
              var evt = document.createEvent('CustomEvent');
              evt.initCustomEvent('bundleReady', false, false, {run: run});
              window.dispatchEvent(evt);
            })();`;

            assets[key].source = () => {
              return wrapper;
            };

            assets[key].size = () => wrapper.length;
          }
        });
        resolve(null);
      });
    });
  }

}

var _default = WaitRunPlugin;
exports.default = _default;