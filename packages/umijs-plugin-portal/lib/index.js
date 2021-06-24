'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require('react'));

  _react = function _react() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require('fs');

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require('path');

  _path = function _path() {
    return data;
  };

  return data;
}

function _waitRunWebpackPlugin() {
  const data = _interopRequireDefault(require('wait-run-webpack-plugin'));

  _waitRunWebpackPlugin = function _waitRunWebpackPlugin() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _default(api) {
  const _api$utils = api.utils,
    Mustache = _api$utils.Mustache,
    lodash = _api$utils.lodash,
    winPath = _api$utils.winPath;
  let runtimePath;

  try {
    runtimePath = winPath(
      (0, _path().dirname)(require.resolve('@umijs/runtime/package.json')),
    );
  } catch (_unused) {
    runtimePath = winPath(
      (0, _path().dirname)(
        require.resolve('umi/node_modules/@umijs/runtime/package.json'),
      ),
    );
  }

  api.logger.info('umi portal plugin.');
  api.describe({
    key: 'portal',
    config: {
      default: {},

      schema(joi) {
        return joi.object({
          auth: joi.object({
            username: joi.string().required(),
            password: joi.string().required(),
          }),
          service: joi.object({
            dataService: joi.string(),
            datalabModeler: joi.string(),
            gateway: joi.string(),
            influxdb: joi.string(),
          }),
          nacos: joi.string(),
        });
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  }); // 生成init.js

  api.onGenerateFiles(() => {
    var _api$config$portal, _api$config;

    const _ref =
        (_api$config$portal =
          (_api$config = api.config) === null || _api$config === void 0
            ? void 0
            : _api$config.portal) !== null && _api$config$portal !== void 0
          ? _api$config$portal
          : {},
      service = _ref.service,
      nacos = _ref.nacos;

    const initTpl = (0, _fs().readFileSync)(
      (0, _path().join)(__dirname, 'init.tpl'),
      'utf-8',
    ); // 生成初始化portal的js

    api.writeTmpFile({
      path: (0, _path().join)('plugin-portal/init.js'),
      content: Mustache.render(initTpl, {
        service: JSON.stringify(service, null, 4) || {},
        nacos,
      }),
    });
  });
  api.onGenerateFiles(() => {
    const historyTpl = (0, _fs().readFileSync)(
      (0, _path().join)(
        __dirname,
        api.config.runtimeHistory ? 'history.runtime.tpl' : 'history.tpl',
      ),
      'utf-8',
    );
    const history = api.config.history; // @ts-ignore

    const type = history.type,
      _history$options = history.options,
      options = _history$options === void 0 ? {} : _history$options; // 生成history

    api.writeTmpFile({
      path: 'core/history.ts',
      content: Mustache.render(historyTpl, {
        creator: `create${lodash.upperFirst(type)}History`,
        options: JSON.stringify(
          _objectSpread(
            _objectSpread({}, options),
            type === 'browser' || type === 'hash'
              ? {
                  basename: api.config.base,
                }
              : {},
          ),
          null,
          2,
        ),
        runtimePath,
      }),
    }); // runtime，提供根节点上下文

    api.writeTmpFile({
      path: 'plugin-portal/runtime.tsx',
      content: (0, _fs().readFileSync)(
        (0, _path().join)(__dirname, 'runtime.tpl'),
        'utf-8',
      ),
    });
  }); // Runtime Plugin

  api.addRuntimePlugin(() => [
    (0, _path().join)(api.paths.absTmpPath, 'plugin-portal/runtime.tsx'),
  ]); // 阻止antd被优化加载，否则antd无法被externals

  api.modifyBabelPresetOpts((opts) => {
    var _opts$import$filter, _opts$import;

    const list =
      (_opts$import$filter =
        (_opts$import = opts.import) === null || _opts$import === void 0
          ? void 0
          : _opts$import.filter((opt) => opt.libraryName !== 'antd')) !==
        null && _opts$import$filter !== void 0
        ? _opts$import$filter
        : [];
    return _objectSpread(
      _objectSpread({}, opts),
      {},
      {
        import: list,
      },
    );
  }); // 复制资源文件到输出目录

  api.modifyConfig((memo) => {
    var _ref2, _api$paths;

    const resourceName =
      api.env === 'development' ? 'development' : 'production.min';
    const copy = [
      ...(memo.copy || []),
      'develop.js',
      {
        from: `${api.paths.absTmpPath.replace(
          (_ref2 =
            ((_api$paths = api.paths) === null || _api$paths === void 0
              ? void 0
              : _api$paths.cwd) + '/') !== null && _ref2 !== void 0
            ? _ref2
            : '',
          '',
        )}/plugin-portal/init.js`,
        to: 'init.js',
      },
      {
        from: `node_modules/react/umd/react.${resourceName}.js`,
        to: 'alone/react.js',
      },
      {
        from: `node_modules/react-dom/umd/react-dom.${resourceName}.js`,
        to: 'alone/react-dom.js',
      },
      {
        from: 'node_modules/moment/min/moment.min.js',
        to: 'alone/moment.js',
      },
      {
        from: 'node_modules/moment/locale/zh-cn.js',
        to: 'alone/zh-cn.js',
      },
      {
        from: 'node_modules/antd/dist/antd-with-locales.js',
        to: 'alone/antd.js',
      },
      {
        from: 'node_modules/antd/dist/antd.css',
        to: 'alone/antd.css',
      },
    ];

    if (api.env === 'development') {
      copy.push({
        from: 'node_modules/antd/dist/antd-with-locales.js.map',
        to: 'alone/antd-with-locales.js.map',
      });
      copy.push({
        from: 'node_modules/moment/min/moment.min.js.map',
        to: 'alone/moment.min.js.map',
      });
      copy.push({
        from: 'node_modules/antd/dist/antd.css.map',
        to: 'alone/antd.css.map',
      });
    } // 引用init.js

    const headScripts = [
      ...(memo.headScripts || []),
      {
        src: 'init.js',
      },
    ];
    return _objectSpread(
      _objectSpread({}, memo),
      {},
      {
        antd: false,
        copy,
        headScripts,
        define: _objectSpread(_objectSpread({}, memo.define), runtimeEnv()),
      },
    );
  });
  api.chainWebpack((config) => {
    const prevConfig = config.toConfig(); // react react-dom antd作为全局资源，不会被打入bundle中

    config.externals([
      _objectSpread(
        _objectSpread({}, prevConfig.externals),
        {},
        {
          react: 'window.React',
          'react-dom': 'window.ReactDOM',
          moment: 'window.moment',
          antd: 'window.antd',
        },
      ),
      function (context, request, callback) {
        const match = /^antd\/es\/(\w+)$/.exec(request);

        if (match) {
          callback(null, 'antd.' + match[1]);
          return;
        }

        callback();
      },
    ]);
    config // 阻止bundle载入后立即启动。具体控制在init.js中
      .plugin('WaitRunWebpackPlugin')
      .use(_waitRunWebpackPlugin().default, [
        {
          test: /umi\.\w*\.?js$/,
        },
      ])
      .end();
    return config;
  });
}

function runtimeEnv() {
  const match = /^RUNTIME_/;
  return Object.keys(process.env)
    .filter((key) => match.test(key))
    .reduce(
      (prev, curr) =>
        _objectSpread(
          _objectSpread({}, prev),
          {},
          {
            ['env.' + curr]: process.env[curr],
          },
        ),
      {},
    );
} // 提取图朴引用的js库名称

function extractJS() {
  const set = new Set();
  const filePath = (0, _path().resolve)(__dirname, '../ht/storage');

  try {
    const files = (0, _fs().readdirSync)(filePath);
    files.forEach((filename) => {
      try {
        if (filename.endsWith('.html')) {
          const content = (0, _fs().readFileSync)(
            (0, _path().join)(filePath, filename),
            'utf-8',
          );
          const matches = content.match(/\.\.\/libs\/ht-\w+\.js/g);

          if (Array.isArray(matches)) {
            matches.forEach((row) => {
              var _row$match;

              set.add(
                (_row$match = row.match(/ht-\w+\.js/)) === null ||
                  _row$match === void 0
                  ? void 0
                  : _row$match[0],
              );
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
