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
        ret = [key, `(function () {
          var run = function (window, document) {
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
    }

    compiler.hooks.thisCompilation.tap('WaitRunWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tap({
        name: 'WaitRunWebpackPlugin',
        // https://webpack.docschina.org/api/compilation-hooks/#list-of-asset-processing-stages
        stage: _webpack().default.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
      }, assets => {
        const values = this.wrapContent(assets);

        if (values.length > 0) {
          compilation.updateAsset(values[0], new (_webpack().default.sources.RawSource)(values[1]));
        } // if (this.options.initFile) {
        //   const content = readFileSync(this.options.initFile, 'utf-8');
        //   compilation.emitAsset(
        //     'init.js',
        //     new webpack.sources.RawSource(content),
        //   );
        // }

      });
    });
  }

}

var _default = WaitRunWebpackPlugin;
exports.default = _default;