import webpack, { Compiler } from 'webpack';

type Options = {
  test: RegExp;
  initFile?: string;
};

class WaitRunWebpackPlugin {
  constructor(private options: Options) {
    if (typeof options.test !== 'object') {
      throw new TypeError('Argument must be an RegExp.');
    }
  }

  wrapContent(assets: any) {
    let ret: string[] = [];
    Object.keys(assets).some((key) => {
      if (this.options.test?.test(key)) {
        ret = [
          key,
          `(function () {
          var run = function (window, document) {
            ${assets[key].source()}
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent('bundleReady', false, false, {run: run});
          window.dispatchEvent(evt);
        })();`,
        ];
        return true;
      }
      return false;
    });
    return ret;
  }

  apply(compiler: Compiler) {
    if (webpack.version.startsWith('4.')) {
      compiler.hooks.emit.tap('WaitRunWebpackPlugin', (compilation) => {
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

    compiler.hooks.thisCompilation.tap(
      'WaitRunWebpackPlugin',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'WaitRunWebpackPlugin',
            // https://webpack.docschina.org/api/compilation-hooks/#list-of-asset-processing-stages
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          (assets) => {
            const values = this.wrapContent(assets);
            if (values.length > 0) {
              compilation.updateAsset(
                values[0],
                new webpack.sources.RawSource(values[1]),
              );
            }

            // if (this.options.initFile) {
            //   const content = readFileSync(this.options.initFile, 'utf-8');
            //   compilation.emitAsset(
            //     'init.js',
            //     new webpack.sources.RawSource(content),
            //   );
            // }
          },
        );
      },
    );
  }
}

export default WaitRunWebpackPlugin;
