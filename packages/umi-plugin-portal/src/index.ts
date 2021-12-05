// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { diffJson } from 'diff';
import { readFileSync } from 'fs';
// @ts-ignore
import md5 from 'md5';
import path, { dirname, join } from 'path';
import WaitRunWebpackPlugin from './WaitRunPlugin';

export default async function (api: IApi) {
  const {
    utils: { Mustache, lodash, winPath },
  } = api;

  let runtimePath: string;
  try {
    runtimePath = winPath(
      dirname(require.resolve('@umijs/runtime/package.json')),
    );
  } catch {
    runtimePath = winPath(
      dirname(require.resolve('umi/node_modules/@umijs/runtime/package.json')),
    );
  }

  api.logger.info('umi portal plugin.');

  api.describe({
    key: 'portal',
    config: {
      default: {
        appDefaultProps: {},
        integration: {
          development: true,
          production: true,
        },
        auth: {
          username: 'admin',
          password: 'admin',
        },
        service: {
          gateway: '//fill_api_here',
          graphql: '//fill_api_here',
        },
        customToken: '',
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
            password: joi.string().required(),
          }),
          /** 当前应用是否作为主应用 */
          mainApp: joi.object({
            /** 应用目录的绝对路径，比如 /public/apps，不能以反斜杠结尾 */
            appPath: joi.string().required(),
          }),
          /** 服务枚举 */
          service: joi.object().pattern(joi.string(), joi.string()),
          /** nacos配置地址 */
          nacos: joi.string(),
          /** 是否集成到portal，因为要编译依赖项，如果切换需要重启 */
          integration: joi.object({
            development: joi.boolean(),
            production: joi.boolean(),
          }),
          customToken: joi.string(),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  });

  // 运行时调用主题样式
  api.addRuntimePluginKey(() => 'lightTheme');
  api.addRuntimePluginKey(() => 'darkTheme');

  api.addRuntimePlugin(() => [
    join(api.paths.absTmpPath!, 'plugin-portal/runtime.tsx'),
  ]);

  api.addEntryImportsAhead(() => {
    return [
      {
        source: './plugin-portal/portal.less',
      },
    ];
  });

  let prevConfig = {};
  api.onGenerateFiles(async () => {
    const configChanged = diffJson(prevConfig, api.config.portal).some(
      (row) => row.added || row.removed,
    );
    if (!configChanged) {
      return;
    }
    prevConfig = api.config.portal;
    api.logger.info('gen portal files...');

    const {
      appKey,
      service,
      nacos,
      appDefaultProps,
      auth,
      customToken,
      mainApp,
      integration,
    } = api.config?.portal ?? {};

    let base64 = '';
    if (api.env !== 'production') {
      base64 =
        'Basic ' +
        Buffer.from(`${auth.username}:${md5(auth.password)}`).toString(
          'base64',
        );
    }

    // 生成portal.less
    api.writeTmpFile({
      path: 'plugin-portal/portal.less',
      content: readFileSync(
        join(__dirname, 'templates', 'portal.less'),
        'utf-8',
      ),
    });

    // 生成init.js
    api.writeTmpFile({
      path: 'plugin-portal/init.ts',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'init.tpl'), 'utf-8'),
        {
          appKey,
          nacos,
          service: JSON.stringify(service, null, 4) || {},
          appPath: mainApp?.appPath?.replace(/\/*$/, '') ?? '',
          integrated: integration[api?.env ?? 'development'],
        },
      ),
    });

    // 生成ThemeLayout.tsx
    api.writeTmpFile({
      path: 'plugin-portal/ThemeLayout.tsx',
      content: readFileSync(
        join(__dirname, 'templates', 'ThemeLayout.tpl'),
        'utf-8',
      ),
    });

    if (mainApp) {
      // 生成单点登录sso.ts
      api.writeTmpFile({
        path: 'plugin-portal/sso.ts',
        content: readFileSync(join(__dirname, 'templates', 'sso.tpl'), 'utf-8'),
      });
    } else {
      // 覆盖umi的history
      const historyTpl = readFileSync(
        join(
          __dirname,
          'templates',
          api.config.runtimeHistory ? 'history.runtime.tpl' : 'history.tpl',
        ),
        'utf-8',
      );
      const history = api.config.history!;
      // @ts-ignore
      const { type, options = {} } = history;

      // 生成history
      api.writeTmpFile({
        path: 'core/history.ts',
        content: Mustache.render(historyTpl, {
          creator: `create${lodash.upperFirst(type)}History`,
          options: JSON.stringify(
            {
              ...options,
              ...(type === 'browser' || type === 'hash'
                ? { basename: api.config.base }
                : {}),
            },
            null,
            2,
          ),
          runtimePath,
          appKey,
        }),
      });
    }

    // 生成portal.ts
    api.writeTmpFile({
      path: 'plugin-portal/portal.ts',
      content: Mustache.render(
        readFileSync(
          join(
            __dirname,
            'templates',
            `portal.${mainApp ? 'real' : 'mock'}.tpl`,
          ),
          'utf-8',
        ),
        {
          basic: base64,
          version: require('../package').version,
        },
      ),
    });

    // 生成sdk.ts
    api.writeTmpFile({
      path: 'plugin-portal/sdk.ts',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'sdk.tpl'), 'utf-8'),
        {
          appKey: appKey,
          appDefaultProps: JSON.stringify(appDefaultProps),
          service: Object.keys(service),
        },
      ),
    });

    // 生成runtime
    api.writeTmpFile({
      path: 'plugin-portal/runtime.tsx',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'runtime.tpl'), 'utf-8'),
        {
          appKey,
          customToken,
          basic: base64,
          appDefaultProps: JSON.stringify(appDefaultProps),
        },
      ),
    });
  });

  // 阻止antd被优化加载，否则antd无法被externals
  api.modifyBabelPresetOpts((opts) => {
    let importList = opts.import || [];
    if (api.config.portal.integration[api?.env ?? 'development']) {
      importList =
        opts.import?.filter((opt) => opt.libraryName !== 'antd') ?? [];
    }
    importList.push({ libraryName: 'lodash', libraryDirectory: '' });

    return {
      ...opts,
      import: importList,
    };
  });

  // webpack额外配置
  api.chainWebpack((config) => {
    // 阻止bundle载入后立即启动。具体控制在init.js中
    config
      .plugin('WaitRunWebpackPlugin')
      .use(WaitRunWebpackPlugin, [{ test: /umi(\.\w+)*\.?js$/ }]);

    config
      .entry('init')
      .add(path.resolve(api.paths.absTmpPath!, 'plugin-portal/init.ts'));

    config.optimization.set('runtimeChunk', 'single');
    return config;
  });

  // 复制资源文件到输出目录
  api.modifyConfig((memo) => {
    const resourceName =
      api.env === 'development' ? 'development' : 'production.min';

    const root = path.resolve(
      dirname(require.resolve('react/package.json', { paths: [api.cwd] })),
      '../../',
    );

    const relative = winPath(path.relative(api.cwd, root) + '/');

    api.logger.info(`Copying directory: '${path.resolve(api.cwd, relative)}'`);

    const copy = [...(memo.copy || [])];

    if (memo.portal.integration[api?.env ?? 'development']) {
      copy.push(
        ...[
          {
            from: `${relative}node_modules/react/umd/react.${resourceName}.js`,
            to: 'alone/react.js',
          },
          {
            from: `${relative}node_modules/react-dom/umd/react-dom.${resourceName}.js`,
            to: 'alone/react-dom.js',
          },
          {
            from: `${relative}node_modules/moment/min/moment.min.js`,
            to: 'alone/moment.js',
          },
          {
            from: `${relative}node_modules/moment/locale/zh-cn.js`,
            to: 'alone/zh-cn.js',
          },
          {
            from: `${relative}node_modules/antd/dist/antd.min.js`,
            to: 'alone/antd.js',
          },
          {
            from: `${relative}node_modules/antd/dist/antd.min.css`,
            to: 'alone/antd.css',
          },
        ],
      );

      if (api.env === 'development') {
        copy.push(
          {
            from: `${relative}node_modules/antd/dist/antd.min.js.map`,
            to: 'alone/antd.min.js.map',
          },
          {
            from: `${relative}node_modules/moment/min/moment.min.js.map`,
            to: 'alone/moment.min.js.map',
          },
          {
            from: `${relative}node_modules/antd/dist/antd.min.css.map`,
            to: 'alone/antd.min.css.map',
          },
          // {
          //   from: `${relative}node_modules/react-router-config/cjs/react-router-config.js.map`,
          //   to: 'react-router-config.js.map',
          // },
        );
      }
    }

    let externals = memo.externals;

    if (memo.portal.integration[api?.env ?? 'development']) {
      externals = [
        {
          ...memo.externals,
          react: 'React',
          'react-dom': 'ReactDOM',
          moment: 'moment',
          antd: 'antd',
        },
        function (context: any, request: string, callback: any) {
          // 会有代码或依赖包直接引用antd中es样式，要排除其打包
          if (/^antd\/es\/[\w\-]+\/style/.test(request)) {
            return callback(null, 'undefined');
          }

          // antd/es/table/hooks/xxx可以打包
          // antd/es/table排除打包
          const match = /^antd\/es\/([\w\-]+)$/.exec(request);
          if (match) {
            callback(null, [
              'antd',
              match[1]
                .replace(/\-(\w)/, (_, $1) => $1.toUpperCase())
                .replace(/^\w/, (letter) => letter.toUpperCase()),
            ]);
            return;
          }
          callback();
        },
      ];
    }

    // 引用init.js
    const headScripts = [...(memo.headScripts || [])];

    return {
      ...memo,
      runtimePublicPath: true,
      publicPath: './',
      hash: true,
      history: { type: 'hash' },
      chunks: ['runtime', 'init', 'umi'],
      externals: externals,
      antd: memo.portal.integration[api?.env ?? 'development']
        ? false
        : memo.antd,
      copy: api.env === 'test' ? memo.copy : copy,
      headScripts,
      define: { ...memo.define, ...runtimeEnv() },
    };
  });
}

function runtimeEnv() {
  const match = /^RUNTIME_/;
  return Object.keys(process.env)
    .filter((key) => match.test(key))
    .reduce(
      (prev, curr) => ({
        ...prev,
        ['env.' + curr]: process.env[curr],
      }),
      {},
    );
}
