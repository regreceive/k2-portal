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

function _crypto() {
  const data = require("crypto");

  _crypto = function _crypto() {
    return data;
  };

  return data;
}

function _diff() {
  const data = require("diff");

  _diff = function _diff() {
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

function _os() {
  const data = require("os");

  _os = function _os() {
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
          devAuth: {
            username: 'admin',
            password: 'f7da3686bd81225d9b35b6166efb0129'
          },
          role: 'app',
          customToken: '',
          interestedMessage: ['portal.theme'],
          declaredMessage: [],
          nacos: {
            default: {
              appRootPathName: '/web/apps',
              service: {
                gateway: '//fill_api_url_here',
                graphql: '//fill_api_url_here'
              }
            }
          }
        },

        schema(joi) {
          return joi.object({
            appDefaultProps: joi.object().description('应用服务化接受默认的传参'),
            devAuth: joi.object({
              username: joi.string().required(),
              password: joi.string().required()
            }).description('开发环境Basic认证，请求产品接口可以免登录通过BCF网关'),
            interestedMessage: joi.array().items(joi.string()).description('订阅感兴趣的消息字段，非订阅消息字段被过滤'),
            declaredMessage: joi.array().items(joi.string()).description('声明消息字段，该字段消息被所有应用接收'),
            customToken: joi.string().description('自定义token，将覆盖http头部的Authorization，优先级高于devAuth。'),
            role: joi.string().pattern(/app|portal/, 'app|portal').description('当前应用类型，是portal还是app'),
            isolateAntd: joi.object({
              antPrefix: joi.string().required().description('antd样式名称前缀。为了与Portal样式隔离，请设置为其他名称。')
            }).description('是否随应用一起按需打包antd，默认使用来自Portal的antd'),
            nacos: joi.object({
              url: joi.string().description('线上的nacos地址，如果不输入，会取default配置'),
              default: joi.object({
                ssoAuthorityUrl: joi.string().description('开启sso后的单点登录地址'),
                customLoginApp: joi.string().description('自定义登录应用key，如果与ssoAuthorityUrl同时开启，框架优先采纳单点登录的配置'),
                appRootPathName: joi.string().description("app根目录相对于web服务所在的路径，默认'/web/apps'"),
                service: joi.object().description('服务')
              }).description('默认nacos配置，可用于本地开发，如果配置了url则默认配置被覆盖')
            }).description('nacos配置')
          });
        },

        onChange: api.ConfigChangeType.regenerateTmpFiles
      }
    }); // 运行时调用主题样式

    api.addRuntimePluginKey(() => 'lightTheme');
    api.addRuntimePluginKey(() => 'darkTheme');
    api.addRuntimePluginKey(() => 'onPortalTitleChange');
    api.addRuntimePlugin(() => [(0, _path().join)(api.paths.absTmpPath, 'plugin-portal/runtime.tsx')]);
    api.addEntryImportsAhead(() => {
      return [{
        source: './plugin-portal/portal.less'
      }];
    });
    let prevConfig = {}; // antd 主题自定义样式

    let antdThemes = [];
    api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
      var _api$config$portal, _api$config;

      const configChanged = (0, _diff().diffJson)(prevConfig, api.config.portal).some(row => row.added || row.removed);

      if (!configChanged) {
        return;
      }

      prevConfig = api.config.portal;
      api.logger.info('gen portal files...');

      const _ref3 = (_api$config$portal = (_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.portal) !== null && _api$config$portal !== void 0 ? _api$config$portal : {},
            nacos = _ref3.nacos,
            appDefaultProps = _ref3.appDefaultProps,
            devAuth = _ref3.devAuth,
            customToken = _ref3.customToken,
            role = _ref3.role,
            isolateAntd = _ref3.isolateAntd,
            interestedMessage = _ref3.interestedMessage,
            declaredMessage = _ref3.declaredMessage;

      const antdPopContainerId = (0, _crypto().createHash)('sha1').update(Math.random().toString()).digest('hex');
      let base64 = '';

      if (api.env !== 'production') {
        base64 = 'Basic ' + Buffer.from(`${devAuth.username}:${devAuth.password}`).toString('base64');
      }

      const nextInterestedMessage = Array.from(new Set([...interestedMessage, 'portal.theme'])); // 生成portal.less

      api.writeTmpFile({
        path: 'plugin-portal/portal.less',
        content: api.env === 'development' || role === 'portal' ? (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'portal.less'), 'utf-8') : ''
      }); // 生成antd自定义主题.less

      if (antdThemes.length > 0) {
        const assets = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'antd.less'), 'utf-8');
        antdThemes.forEach(theme => {
          api.writeTmpFile({
            path: `plugin-portal/${theme}.less`,
            content: [`@import '~@/antd-theme/${theme}.less';`, assets].join(_os().EOL)
          });
        });
      } // 生成init.js


      api.writeTmpFile({
        path: 'plugin-portal/init.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'init.tpl'), 'utf-8'), {
          antdPopContainerId,
          nacos: JSON.stringify(nacos.default, null, 4) || '{}',
          nacosUrl: nacos.url,
          antdThemes: JSON.stringify(antdThemes),
          isolateAntd: !!isolateAntd,
          webpack5: !!api.userConfig.webpack5,
          version: require('../package').version
        })
      }); // 生成ThemeLayout.tsx

      api.writeTmpFile({
        path: 'plugin-portal/ThemeLayout.tsx',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'ThemeLayout.tpl'), 'utf-8'), {
          antdPopContainerId
        })
      });

      if (role === 'portal') {
        // 生成单点登录sso.ts
        api.writeTmpFile({
          path: 'plugin-portal/SingleSign.ts',
          content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'SingleSign.tpl'), 'utf-8')
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
            runtimePath
          })
        });
      } // 生成portal.ts


      api.writeTmpFile({
        path: 'plugin-portal/portal.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', `portal.${role === 'portal' ? 'real' : 'mock'}.tpl`), 'utf-8'), {
          basic: base64,
          declaredMessage: JSON.stringify(declaredMessage),
          version: require('../package').version,
          title: api.config.title
        })
      }); // 生成sdk.ts

      const interestStr = JSON.stringify(nextInterestedMessage);
      api.writeTmpFile({
        path: 'plugin-portal/sdk.ts',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'sdk.tpl'), 'utf-8'), {
          service: Object.keys(nacos.default.service),
          interestedMessage: interestStr,
          interestedMessageType: interestStr.replace(/","/g, '"|"').replace(/\[|\]/g, '')
        })
      }); // 生成runtime

      api.writeTmpFile({
        path: 'plugin-portal/runtime.tsx',
        content: Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'templates', 'runtime.tpl'), 'utf-8'), {
          antdPopContainerId,
          customToken,
          basic: base64,
          appDefaultProps: JSON.stringify(appDefaultProps),
          interestedMessage: interestStr,
          isolateAntd,
          title: api.config.title
        })
      });
    })); // 阻止antd被优化加载，否则antd无法被externals

    api.modifyBabelPresetOpts(opts => {
      let importList = opts.import || [];

      if (!api.config.portal.isolateAntd) {
        importList = importList.filter(row => row.libraryName !== 'antd');
      }

      importList.push({
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false
      });
      return _objectSpread(_objectSpread({}, opts), {}, {
        import: importList
      });
    }); // webpack额外配置

    api.chainWebpack((config, {
      webpack
    }) => {
      var _webpack$version;

      antdThemes.forEach(themeName => {
        config.entry('theme-' + themeName).add(_path().default.resolve(api.paths.absTmpPath, `plugin-portal/${themeName}.less`));
      }); // 阻止bundle载入后立即启动。具体控制在init.js中

      config.plugin('WaitRunWebpackPlugin').use(_WaitRunPlugin.default, [{
        test: /umi(\.\w+)*\.?js$/
      }]);
      config.entry('init').add(_path().default.resolve(api.paths.absTmpPath, 'plugin-portal/init.ts'));
      config.optimization.set('runtimeChunk', 'single');
      config.module.rule('graphql').test(/\.(gql|graphql)$/).exclude.add(/node_modules/).end().use('graphql-modules').loader(require.resolve('./graphql-loader')); // compatible with react-dnd

      if ((_webpack$version = webpack.version) === null || _webpack$version === void 0 ? void 0 : _webpack$version.startsWith('5.')) {
        // v4会报错
        config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false);
      } // 确保打包输出不同的css名称，防止多应用样式冲突


      if (api.env === 'production') {
        const hashPrefix = Math.random().toString().slice(-5);
        config.module.rule('css').oneOf('css-modules').use('css-loader').tap(options => {
          return _objectSpread(_objectSpread({}, options), {}, {
            modules: _objectSpread(_objectSpread({}, options.modules), {}, {
              hashPrefix
            })
          });
        });
        config.module.rule('less').oneOf('css-modules').use('css-loader').tap(options => {
          return _objectSpread(_objectSpread({}, options), {}, {
            modules: _objectSpread(_objectSpread({}, options.modules), {}, {
              hashPrefix
            })
          });
        });
      }

      return config;
    }); // 复制资源文件到输出目录

    api.modifyConfig(memo => {
      const isolateAntd = memo.portal.isolateAntd;

      if (!isolateAntd) {
        try {
          const themeName = /[\w\d\-]+(?=\.less$)/;
          antdThemes = (0, _fs().readdirSync)(_path().default.resolve(api.paths.absSrcPath, 'antd-theme')).map(filename => {
            var _result$;

            const result = themeName.exec(filename);
            return (_result$ = result === null || result === void 0 ? void 0 : result[0]) !== null && _result$ !== void 0 ? _result$ : '';
          }).filter(filename => filename);
        } catch (_unused2) {}
      }

      const resourceName = api.env === 'development' ? 'development' : 'production.min';

      const root = _path().default.resolve((0, _path().dirname)(require.resolve('react/package.json', {
        paths: [api.cwd]
      })), '../../');

      const relative = winPath((_path().default.relative(api.cwd, root) + '/').replace(/^\/$/, ''));
      api.logger.info('Relative Path:', relative);
      api.logger.info('Copying Modules Path:', _path().default.resolve(api.cwd, relative, 'node_modules'));
      const copy = [...(memo.copy || [])];
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
      }]);

      if (antdThemes.length === 0 && !isolateAntd) {
        copy.push({
          from: `${relative}node_modules/antd/dist/antd.min.css`,
          to: 'alone/antd.css'
        });
      }

      if (api.env === 'production' && !isolateAntd) {
        copy.push({
          from: `${relative}node_modules/antd/dist/antd.min.js`,
          to: 'alone/antd.js'
        });
      }

      if (api.env === 'development') {
        copy.push({
          from: `${relative}node_modules/moment/min/moment.min.js.map`,
          to: 'alone/moment.min.js.map'
        });

        if (!isolateAntd) {
          copy.push( // 方便本地调试框架对antd的兼容性问题
          {
            from: `${relative}node_modules/antd/dist/antd.js`,
            to: 'alone/antd.js'
          }, {
            from: `${relative}node_modules/antd/dist/antd.js.map`,
            to: 'alone/antd.min.js.map'
          });

          if (antdThemes.length === 0) {
            copy.push({
              from: `${relative}node_modules/antd/dist/antd.min.css.map`,
              to: 'alone/antd.min.css.map'
            });
          }
        }
      }

      const esStyle = /^antd\/es\/[\w\-]+\/style/;
      const esModule = /^antd\/es\/([\w\-]+)$/;
      const linkedString = /\-(\w)/;
      const initials = /^\w/;

      const handle = function handle({
        request
      }, callback) {
        // 会有代码或依赖包直接引用antd中es样式，要排除其打包
        if (esStyle.test(request)) {
          return callback(null, 'undefined');
        } // antd/es/table/hooks/xxx可以打包
        // antd/es/table排除打包


        const match = esModule.exec(request);

        if (match) {
          callback(null, ['antd', match[1].replace(linkedString, (_, $1) => $1.toUpperCase()).replace(initials, letter => letter.toUpperCase())]);
          return;
        }

        callback();
      };

      let externals = [_objectSpread(_objectSpread({}, memo.externals), {}, {
        react: 'React',
        'react-dom': 'ReactDOM',
        moment: 'moment'
      })];

      if (!isolateAntd) {
        externals[0].antd = 'antd';
        externals.push(memo.webpack5 ? handle : (context, request, cb) => handle({
          request
        }, cb));
      }

      return _objectSpread(_objectSpread({}, memo), {}, {
        runtimePublicPath: true,
        publicPath: './',
        hash: true,
        history: {
          type: 'hash'
        },
        chunks: ['runtime', 'init', 'umi'],
        externals: externals,
        copy: api.env === 'test' ? memo.copy : copy,
        manifest: {},
        define: _objectSpread(_objectSpread({}, memo.define), runtimeEnv()),
        // antd: false,
        theme: isolateAntd ? _objectSpread(_objectSpread({}, memo.theme), {}, {
          '@ant-prefix': isolateAntd.antPrefix
        }) : memo.theme
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
}