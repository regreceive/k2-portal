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

  // checkIgnore(resolveData: any) {
  //   if (/^antd\/es\/\S+\/style/.test(resolveData.request)) {
  //     return false;
  //   }
  //   return undefined;
  // }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('wait-run-plugin', (Compilation) => {
      const options = this.options;
      return new Promise((resolve, reject) => {
        const assets = Compilation.assets;
        Object.keys(assets).forEach((key) => {
          if (options.test?.test(key)) {
            const wrapper = `(function () {
              var run = function (window, document) {
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

    // compiler.hooks.normalModuleFactory.tap('IgnorePlugin', (nmf) => {
    //   nmf.hooks.beforeResolve.tap('IgnorePlugin', this.checkIgnore);
    // });
  }
}

export default WaitRunPlugin;
