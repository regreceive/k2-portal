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
          reactInModule: false,
          auth: {
            username: 'admin',
            password: 'admin'
          },
          service: {
            dataService: '//fill_api_here',
            datalabModeler: '//fill_api_here',
            gateway: '//fill_api_here',
            influxdb: '//fill_api_here'
          }
        },

        schema(joi) {
          return joi.object({
            appDefaultProps: joi.object(),
            auth: joi.object({
              username: joi.string().required(),
              password: joi.string().required()
            }),
            service: joi.object({
              dataService: joi.string(),
              datalabModeler: joi.string(),
              gateway: joi.string(),
              influxdb: joi.string(),
              repo: joi.string(),
              dev: joi.string()
            }),
            nacos: joi.string(),
            reactInModule: joi.bool
          });
        },

        onChange: api.ConfigChangeType.regenerateTmpFiles
      }
    });
    api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
      var _api$config$portal, _api$config;

      const _ref3 = (_api$config$portal = (_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.portal) !== null && _api$config$portal !== void 0 ? _api$config$portal : {},
            service = _ref3.service,
            appDefaultProps = _ref3.appDefaultProps;

      const strArray = Object.entries(service).map(([key, value]) => {
        return `${key}: new MockService(window.$$config.service.${key})`;
      });
      const sdkTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'sdk.tpl'), 'utf-8');
      api.writeTmpFile({
        path: (0, _path().join)('plugin-portal/sdk.ts'),
        content: Mustache.render(sdkTpl, {
          service: strArray.join(',\n'),
          appDefaultProps: JSON.stringify(appDefaultProps)
        })
      });
      api.writeTmpFile({
        path: 'plugin-portal/MockService.ts',
        content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'MockService.tpl'), 'utf-8')
      });
    }));
    api.addRuntimePlugin(() => [(0, _path().join)(api.paths.absTmpPath, 'plugin-portal/runtime.tsx')]);
    api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
      var _api$config$portal2, _api$config2;

      const _ref5 = (_api$config$portal2 = (_api$config2 = api.config) === null || _api$config2 === void 0 ? void 0 : _api$config2.portal) !== null && _api$config$portal2 !== void 0 ? _api$config$portal2 : {},
            service = _ref5.service,
            nacos = _ref5.nacos,
            appDefaultProps = _ref5.appDefaultProps;

      const initTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'init.tpl'), 'utf-8'); // 生成init.js

      api.writeTmpFile({
        path: (0, _path().join)('plugin-portal/init.js'),
        content: Mustache.render(initTpl, {
          service: JSON.stringify(service, null, 4) || {},
          nacos,
          reactInModule: api.env !== 'production' && api.config.portal.reactInModule
        })
      }); // runtime，提供根节点上下文

      const base64 = Buffer.from(`${api.config.portal.auth.username}:${(0, _md().default)(api.config.portal.auth.password)}`).toString('base64');
      api.writeTmpFile({
        path: 'plugin-portal/runtime.tsx',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'runtime.tpl'), 'utf-8'), {
          authorization: api.env === 'production' ? '' : `Basic ${base64}`,
          appDefaultProps: JSON.stringify(appDefaultProps)
        })
      });
    })); // 覆盖umi的history

    api.onGenerateFiles(() => {
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
          runtimePath
        })
      });
    });
    api.onStart(() => {
      if (api.env !== 'production' && !api.config.portal.reactInModule) {
        // 阻止antd被优化加载，否则antd无法被externals
        api.modifyBabelPresetOpts(opts => {
          var _opts$import$filter, _opts$import;

          const list = (_opts$import$filter = (_opts$import = opts.import) === null || _opts$import === void 0 ? void 0 : _opts$import.filter(opt => opt.libraryName !== 'antd')) !== null && _opts$import$filter !== void 0 ? _opts$import$filter : [];
          return _objectSpread(_objectSpread({}, opts), {}, {
            import: list
          });
        });
        api.chainWebpack(config => {
          const prevConfig = config.toConfig(); // react react-dom antd作为全局资源，不会被打入bundle中

          config.externals([_objectSpread(_objectSpread({}, prevConfig.externals), {}, {
            react: 'window.React',
            'react-dom': 'window.ReactDOM',
            moment: 'window.moment',
            antd: 'window.antd'
          }), function (context, request, callback) {
            const match = /^antd\/es\/(\w+)$/.exec(request);

            if (match) {
              callback(null, 'antd.' + match[1]);
              return;
            }

            callback();
          }]);
          config // 阻止bundle载入后立即启动。具体控制在init.js中
          .plugin('WaitRunWebpackPlugin').use(_WaitRunPlugin.default, [{
            test: /umi\.\w*\.?js$/
          }]).end();
          return config;
        });
      }
    }); // 复制资源文件到输出目录

    api.modifyConfig(memo => {
      var _ref6, _api$paths;

      const resourceName = api.env === 'development' ? 'development' : 'production.min';
      let relative = '';

      try {
        const root = _path().default.resolve((0, _path().dirname)(require.resolve('react/package.json')), '../../'); // lerna


        if (root !== api.cwd) {
          relative = winPath(_path().default.relative(api.cwd, root)) + '/';
        }
      } catch (_unused2) {}

      const copy = [...(memo.copy || []), 'develop.js', {
        from: `${api.paths.absTmpPath.replace((_ref6 = ((_api$paths = api.paths) === null || _api$paths === void 0 ? void 0 : _api$paths.cwd) + '/') !== null && _ref6 !== void 0 ? _ref6 : '', '')}/plugin-portal/init.js`,
        to: 'init.js'
      }];

      if (api.env !== 'production' && !memo.portal.reactInModule) {
        copy.concat([{
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
          from: `${relative}node_modules/antd/dist/antd-with-locales.js`,
          to: 'alone/antd.js'
        }, {
          from: `${relative}node_modules/antd/dist/antd.css`,
          to: 'alone/antd.css'
        }]);

        if (api.env === 'development') {
          copy.push({
            from: `${relative}node_modules/antd/dist/antd-with-locales.js.map`,
            to: 'alone/antd-with-locales.js.map'
          });
          copy.push({
            from: `${relative}node_modules/moment/min/moment.min.js.map`,
            to: 'alone/moment.min.js.map'
          });
          copy.push({
            from: `${relative}node_modules/antd/dist/antd.css.map`,
            to: 'alone/antd.css.map'
          });
        }
      } // 引用init.js


      const headScripts = [...(memo.headScripts || []), {
        src: 'init.js'
      }];
      return _objectSpread(_objectSpread({}, memo), {}, {
        antd: api.env !== 'production' && memo.portal.reactInModule ? memo.antd : false,
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