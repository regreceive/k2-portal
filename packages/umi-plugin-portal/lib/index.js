"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _md() {
  const data = _interopRequireDefault(require("md5"));

  _md = function _md() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireWildcard(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

var _WaitRunPlugin = _interopRequireDefault(require("./WaitRunPlugin"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (api) {
    const _api$utils = api.utils,
          Mustache = _api$utils.Mustache,
          lodash = _api$utils.lodash,
          winPath = _api$utils.winPath;
    let runtimePath;

    try {
      runtimePath = winPath((0, _path().dirname)(require.resolve('@umijs/runtime/package.json')));
    } catch (_unused) {
      runtimePath = winPath((0, _path().dirname)(require.resolve('umi/node_modules/@umijs/runtime/package.json')));
    }

    api.logger.info('umi portal plugin.');
    api.describe({
      key: 'portal',
      config: {
        default: {
          appDefaultProps: {},
          integration: {
            development: true,
            production: true
          },
          auth: {
            username: 'admin',
            password: 'admin'
          },
          service: {
            dataService: '//fill_api_here',
            datalabModeler: '//fill_api_here',
            gateway: '//fill_api_here',
            influxdb: '//fill_api_here',
            repo: '//fill_api_here'
          },
          buttonPermissionCheck: false,
          customToken: ''
        },

        schema(joi) {
          return joi.object({
            /** appKey默认名称，集成到portal里面会替换成正确名称 */
            appKey: joi.string().required(),

            /** app传参默认值 */
            appDefaultProps: joi.object(),

            /** Basic认证插入请求头部，仅限开发 */
            auth: joi.object({
              username: joi.string().required(),
              password: joi.string().required()
            }),

            /** 当前应用是否作为主应用 */
            mainApp: joi.object({
              /** 应用目录的绝对路径，比如 /public/apps，不能以反斜杠结尾 */
              appPath: joi.string().pattern(/^\/[\w\d\/]+[^\/]$/).required()
            }),

            /** 服务枚举 */
            service: joi.object().pattern(joi.string(), joi.string()),

            /** nacos配置地址 */
            nacos: joi.string(),

            /** 是否开启按钮级别权限验证 */
            buttonPermissionCheck: joi.boolean(),

            /** 是否集成到portal，因为要编译依赖项，如果切换需要重启 */
            integration: joi.object({
              development: joi.boolean(),
              production: joi.boolean()
            }),
            customToken: joi.string()
          });
        },

        onChange: api.ConfigChangeType.regenerateTmpFiles
      }
    }); // 运行时调用主题样式

    api.addRuntimePluginKey(() => 'lightTheme');
    api.addRuntimePluginKey(() => 'darkTheme');
    api.addRuntimePlugin(() => [(0, _path().join)(api.paths.absTmpPath, 'plugin-portal/runtime.tsx')]);
    api.addEntryImportsAhead(() => {
      return [{
        source: './plugin-portal/portal.less'
      }];
    });
    api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
      var _api$config$portal, _api$config, _mainApp$appPath, _api$env;

      const _ref3 = (_api$config$portal = (_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.portal) !== null && _api$config$portal !== void 0 ? _api$config$portal : {},
            appKey = _ref3.appKey,
            service = _ref3.service,
            nacos = _ref3.nacos,
            appDefaultProps = _ref3.appDefaultProps,
            auth = _ref3.auth,
            buttonPermissionCheck = _ref3.buttonPermissionCheck,
            customToken = _ref3.customToken,
            mainApp = _ref3.mainApp;

      const base64 = api.env === 'production' ? '' : 'Basic ' + Buffer.from(`${auth.username}:${(0, _md().default)(auth.password)}`).toString('base64'); // 生成portal.less

      api.writeTmpFile({
        path: 'plugin-portal/portal.less',
        content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'portal.less'), 'utf-8')
      }); // 生成init.js

      api.writeTmpFile({
        path: 'plugin-portal/init.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'init.tpl'), 'utf-8'), {
          appKey,
          nacos,
          service: JSON.stringify(service, null, 4) || {},
          appPath: (_mainApp$appPath = mainApp === null || mainApp === void 0 ? void 0 : mainApp.appPath) !== null && _mainApp$appPath !== void 0 ? _mainApp$appPath : '',
          integrated: api.config.portal.integration[(_api$env = api === null || api === void 0 ? void 0 : api.env) !== null && _api$env !== void 0 ? _api$env : 'development']
        })
      }); // 生成ThemeLayout.tsx

      api.writeTmpFile({
        path: 'plugin-portal/ThemeLayout.tsx',
        content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'ThemeLayout.tpl'), 'utf-8')
      }); // 生成CommonQuery.ts

      api.writeTmpFile({
        path: 'plugin-portal/CommonQuery.ts',
        content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'CommonQuery.tpl'), 'utf-8')
      });

      if (mainApp) {
        // 生成单点登录sso.ts
        api.writeTmpFile({
          path: 'plugin-portal/sso.ts',
          content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'sso.tpl'), 'utf-8')
        });
      } else {
        // 覆盖umi的history
        const historyTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', api.config.runtimeHistory ? 'history.runtime.tpl' : 'history.tpl'), 'utf-8');
        const history = api.config.history; // @ts-ignore

        const type = history.type,
              _history$options = history.options,
              options = _history$options === void 0 ? {} : _history$options; // 生成history

        api.writeTmpFile({
          path: 'core/history.ts',
          content: Mustache.render(historyTpl, {
            creator: `create${lodash.upperFirst(type)}History`,
            options: JSON.stringify(_objectSpread(_objectSpread({}, options), type === 'browser' || type === 'hash' ? {
              basename: api.config.base
            } : {}), null, 2),
            runtimePath,
            appKey
          })
        });
      } // 生成portal.ts


      api.writeTmpFile({
        path: 'plugin-portal/portal.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', `portal.${mainApp ? 'real' : 'mock'}.tpl`), 'utf-8'), {
          basic: base64,
          version: require('../package').version
        })
      }); // 生成sdk.ts

      api.writeTmpFile({
        path: 'plugin-portal/sdk.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'sdk.tpl'), 'utf-8'), {
          appKey: appKey,
          buttonPermissionCheck,
          appDefaultProps: JSON.stringify(appDefaultProps),
          service: Object.keys(service)
        })
      }); // 生成CommonService.ts

      api.writeTmpFile({
        path: 'plugin-portal/CommonService.ts',
        content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'CommonService.tpl'), 'utf-8')
      }); // 生成runtime

      api.writeTmpFile({
        path: 'plugin-portal/runtime.tsx',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'runtime.tpl'), 'utf-8'), {
          appKey,
          customToken,
          basic: base64,
          appDefaultProps: JSON.stringify(appDefaultProps)
        })
      });
    })); // 阻止antd被优化加载，否则antd无法被externals

    api.modifyBabelPresetOpts(opts => {
      var _api$env2;

      let importList = opts.import || [];

      if (api.config.portal.integration[(_api$env2 = api === null || api === void 0 ? void 0 : api.env) !== null && _api$env2 !== void 0 ? _api$env2 : 'development']) {
        var _opts$import$filter, _opts$import;

        importList = (_opts$import$filter = (_opts$import = opts.import) === null || _opts$import === void 0 ? void 0 : _opts$import.filter(opt => opt.libraryName !== 'antd')) !== null && _opts$import$filter !== void 0 ? _opts$import$filter : [];
      }

      importList.push({
        libraryName: 'lodash',
        libraryDirectory: ''
      });
      return _objectSpread(_objectSpread({}, opts), {}, {
        import: importList
      });
    }); // webpack额外配置

    api.chainWebpack(config => {
      // 阻止bundle载入后立即启动。具体控制在init.js中
      config.plugin('WaitRunWebpackPlugin').use(_WaitRunPlugin.default, [{
        test: /umi(\.\w+)*\.?js$/
      }]);
      config.entry('init').add(_path().default.resolve(api.paths.absTmpPath, 'plugin-portal/init.ts'));
      config.optimization.set('runtimeChunk', 'single');
      return config;
    }); // 复制资源文件到输出目录

    api.modifyConfig(memo => {
      var _api$env3, _api$env4, _api$env5;

      const resourceName = api.env === 'development' ? 'development' : 'production.min';
      let relative = '';

      try {
        const root = _path().default.resolve((0, _path().dirname)(require.resolve('react/package.json')), '../../'); // lerna


        if (root !== api.cwd) {
          if (root.includes('k2-portal')) {
            // 本地link过去的
            relative = winPath(_path().default.relative(api.cwd, '../../')) + '/';
          } else {
            relative = winPath(_path().default.relative(api.cwd, root)) + '/';
          }
        }
      } catch (_unused2) {}

      const copy = [...(memo.copy || [])];

      if (memo.portal.integration[(_api$env3 = api === null || api === void 0 ? void 0 : api.env) !== null && _api$env3 !== void 0 ? _api$env3 : 'development']) {
        copy.push(...[{
          from: `${relative}node_modules/react/umd/react.${resourceName}.js`,
          to: 'alone/react.js'
        }, {
          from: `${relative}node_modules/react-dom/umd/react-dom.${resourceName}.js`,
          to: 'alone/react-dom.js'
        }, {
          from: `${relative}node_modules/moment/min/moment.min.js`,
          to: 'alone/moment.js'
        }, {
          from: `${relative}node_modules/moment/locale/zh-cn.js`,
          to: 'alone/zh-cn.js'
        }, {
          from: `${relative}node_modules/antd/dist/antd.min.js`,
          to: 'alone/antd.js'
        }, {
          from: `${relative}node_modules/antd/dist/antd.min.css`,
          to: 'alone/antd.css'
        }]);

        if (api.env === 'development') {
          copy.push({
            from: `${relative}node_modules/antd/dist/antd.min.js.map`,
            to: 'alone/antd.min.js.map'
          });
          copy.push({
            from: `${relative}node_modules/moment/min/moment.min.js.map`,
            to: 'alone/moment.min.js.map'
          });
          copy.push({
            from: `${relative}node_modules/antd/dist/antd.min.css.map`,
            to: 'alone/antd.min.css.map'
          });
        }
      }

      let externals = memo.externals;

      if (memo.portal.integration[(_api$env4 = api === null || api === void 0 ? void 0 : api.env) !== null && _api$env4 !== void 0 ? _api$env4 : 'development']) {
        externals = [_objectSpread(_objectSpread({}, memo.externals), {}, {
          react: 'React',
          'react-dom': 'ReactDOM',
          moment: 'moment',
          antd: 'antd'
        }), function (context, request, callback) {
          // 会有代码或依赖包直接引用antd中es样式，要排除其打包
          if (/^antd\/es\/[\w\-]+\/style/.test(request)) {
            return callback(null, 'undefined');
          } // antd/es/table/hooks/xxx可以打包
          // antd/es/table排除打包


          const match = /^antd\/es\/([\w\-]+)$/.exec(request);

          if (match) {
            callback(null, ['antd', match[1].replace(/\-(\w)/, (_, $1) => $1.toUpperCase()).replace(/^\w/, letter => letter.toUpperCase())]);
            return;
          }

          callback();
        }];
      } // 引用init.js


      const headScripts = [...(memo.headScripts || [])];
      return _objectSpread(_objectSpread({}, memo), {}, {
        runtimePublicPath: true,
        publicPath: './',
        hash: true,
        chunks: ['runtime', 'init', 'umi'],
        externals: externals,
        antd: memo.portal.integration[(_api$env5 = api === null || api === void 0 ? void 0 : api.env) !== null && _api$env5 !== void 0 ? _api$env5 : 'development'] ? false : memo.antd,
        copy: api.env === 'test' ? memo.copy : copy,
        headScripts,
        define: _objectSpread(_objectSpread({}, memo.define), runtimeEnv())
      });
    });
  });
  return _ref.apply(this, arguments);
}

function runtimeEnv() {
  const match = /^RUNTIME_/;
  return Object.keys(process.env).filter(key => match.test(key)).reduce((prev, curr) => _objectSpread(_objectSpread({}, prev), {}, {
    ['env.' + curr]: process.env[curr]
  }), {});
} // 提取图朴引用的js库名称


function extractJS() {
  const set = new Set();
  const filePath = (0, _path().resolve)(__dirname, '../ht/storage');

  try {
    const files = (0, _fs().readdirSync)(filePath);
    files.forEach(filename => {
      try {
        if (filename.endsWith('.html')) {
          const content = (0, _fs().readFileSync)((0, _path().join)(filePath, filename), 'utf-8');
          const matches = content.match(/\.\.\/libs\/ht-\w+\.js/g);

          if (Array.isArray(matches)) {
            matches.forEach(row => {
              var _row$match;

              set.add((_row$match = row.match(/ht-\w+\.js/)) === null || _row$match === void 0 ? void 0 : _row$match[0]);
            });
          }
        }
      } catch (err) {
        console.warn('获取文件图朴html的stats失败');
      }
    });
  } catch (e) {
    console.warn('没有找到输出文件');
    return [];
  }

  const libs = Array.from(set);
  return libs.length > 0 ? ['ht.js', ...libs] : [];
}