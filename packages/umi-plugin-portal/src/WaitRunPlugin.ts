import webpack, { Compiler } from 'webpack';

type Options = {
  test: RegExp;
};

const allowedPortalProps = [
  'SVGElement',
  'HTMLCanvasElement',
  'innerWidth',
  'innerHeight',
  'scrollX',
  'scrollY',
  'pageXOffset',
  'pageYOffset',
  'addEventListener',
  'removeEventListener',
  'RegExp',
].join(',');

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
        // SVGElement 为了兼容jointjs
        ret = [
          key,
          `(function () {
          var run = function (ownWindow, window, self, globalThis, document, ${allowedPortalProps}) {
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

    // 适配webpack5
    const chunkNameMatcher = this.options.test;
    compiler.hooks.compilation.tap('WaitRunWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'WaitRunWebpackPlugin',
          // https://webpack.docschina.org/api/compilation-hooks/#list-of-asset-processing-stages
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          for (const chunk of compilation.chunks) {
            if (chunk.canBeInitial()) {
              for (const file of chunk.files) {
                if (chunkNameMatcher.test(file)) {
                  compilation.updateAsset(file, (old) => {
                    // SVGElement 为了兼容jointjs
                    return new webpack.sources.ConcatSource(
                      `(function () {
                        var run = function (ownWindow, window, self, globalThis, document, ${allowedPortalProps}) {\n`,
                      old,
                      `\n };
                        var evt = document.createEvent('CustomEvent');
                        evt.initCustomEvent('bundleReady', false, false, {run: run});
                        window.dispatchEvent(evt);
                      })();`,
                    );
                  });
                }
              }
            }
          }
        },
      );
    });
  }
}

export default WaitRunWebpackPlugin;
