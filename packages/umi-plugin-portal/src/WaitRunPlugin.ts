import { Compiler } from 'webpack';

type Options = {
  test: RegExp;
};

class WaitRunPlugin {
  constructor(private options: Options) {
    if (typeof options.test !== 'object') {
      throw new TypeError('Argument must be an RegExp.');
    }
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('wait-run-plugin', (Compilation) => {
      const options = this.options;
      return new Promise((resolve, reject) => {
        const assets = Compilation.assets;
        Object.keys(assets).forEach((key) => {
          if (options.test?.test(key)) {
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

export default WaitRunPlugin;
