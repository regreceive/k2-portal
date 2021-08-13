// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { readdirSync, readFileSync } from 'fs';
// @ts-ignore
import md5 from 'md5';
import path, { dirname, join, resolve } from 'path';
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
          dataService: '//fill_api_here',
          datalabModeler: '//fill_api_here',
          gateway: '//fill_api_here',
          influxdb: '//fill_api_here',
          repo: '//fill_api_here',
        },
        buttonPermissionCheck: false,
        bearer: '',
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
          /** 服务枚举，太过冗余，是为了适配portal， */
          service: joi.object({
            dataService: joi.string(),
            datalabModeler: joi.string(),
            gateway: joi.string(),
            influxdb: joi.string(),
            repo: joi.string(),
            dev: joi.string(),
          }),
          /** nacos配置地址 */
          nacos: joi.string(),
          /** 是否开启按钮级别权限验证 */
          buttonPermissionCheck: joi.boolean(),
          /** 是否集成到portal，因为要编译依赖项，如果切换需要重启 */
          integration: joi.object({
            development: joi.boolean(),
            production: joi.boolean(),
          }),
          bearer: joi.string(),
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

  api.onGenerateFiles(async () => {
    const {
      appKey,
      service,
      nacos,
      appDefaultProps,
      auth,
      buttonPermissionCheck,
      bearer,
    } = api.config?.portal ?? {};

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
      path: 'plugin-portal/init.js',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'init.tpl'), 'utf-8'),
        {
          appKey,
          nacos,
          service: JSON.stringify(service, null, 4) || {},
          integrated: api.config.portal.integration[api?.env ?? 'development'],
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

    // 生成common.ts
    api.writeTmpFile({
      path: 'plugin-portal/common.ts',
      content: readFileSync(
        join(__dirname, 'templates', 'common.tpl'),
        'utf-8',
      ),
    });

    // 生成sdk.ts
    api.writeTmpFile({
      path: 'plugin-portal/sdk.ts',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'sdk.tpl'), 'utf-8'),
        {
          appKey: appKey,
          buttonPermissionCheck,
          appDefaultProps: JSON.stringify(appDefaultProps),
          service: Object.keys(service),
        },
      ),
    });

    // 生成MockService.ts
    api.writeTmpFile({
      path: 'plugin-portal/MockService.ts',
      content: readFileSync(
        join(__dirname, 'templates', 'MockService.tpl'),
        'utf-8',
      ),
    });

    // 生成runtime
    const base64 =
      api.env === 'production'
        ? ''
        : 'Basic ' +
          Buffer.from(`${auth.username}:${md5(auth.password)}`).toString(
            'base64',
          );

    api.writeTmpFile({
      path: 'plugin-portal/runtime.tsx',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'runtime.tpl'), 'utf-8'),
        {
          appKey,
          bearer,
          authorization: base64,
          appDefaultProps: JSON.stringify(appDefaultProps),
        },
      ),
    });

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
      }),
    });
  });

  // 阻止antd被优化加载，否则antd无法被externals
  api.modifyBabelPresetOpts((opts) => {
    let importList = opts.import;
    if (api.config.portal.integration[api?.env ?? 'development']) {
      importList =
        opts.import?.filter((opt) => opt.libraryName !== 'antd') ?? [];
    }

    return {
      ...opts,
      import: importList,
    };
  });

  // webpack额外配置
  api.chainWebpack((config) => {
    // 阻止bundle载入后立即启动。具体控制在init.js中
    config
      .plugin('WaitRun')
      .use(WaitRunWebpackPlugin, [{ test: /umi\.\w*\.?js$/ }]);

    // 阻止直接加载antd/es/xx/style形式的样式
    // config.plugin('Ignore').use(IgnorePlugin, [
    //   {
    //     resourceRegExp: /^antd\/es\/[\w\-]+\/style/,
    //   },
    // ]);
    return config;
  });

  // 复制资源文件到输出目录
  api.modifyConfig((memo) => {
    const resourceName =
      api.env === 'development' ? 'development' : 'production.min';

    let relative = '';
    try {
      const root = path.resolve(
        dirname(require.resolve('react/package.json')),
        '../../',
      );

      // lerna
      if (root !== api.cwd) {
        if (root.endsWith('k2-portal')) {
          // 本地link过去的
          relative = winPath(path.relative(api.cwd, '../../')) + '/';
        } else {
          relative = winPath(path.relative(api.cwd, root)) + '/';
        }
      }
    } catch {}

    const copy = [
      ...(memo.copy || []),
      'develop.js',
      {
        from: `${api.paths.absTmpPath!.replace(
          api.paths?.cwd + '/' ?? '',
          '',
        )}/plugin-portal/init.js`,
        to: 'init.js',
      },
    ];

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
        copy.push({
          from: `${relative}node_modules/antd/dist/antd.min.js.map`,
          to: 'alone/antd.min.js.map',
        });
        copy.push({
          from: `${relative}node_modules/moment/min/moment.min.js.map`,
          to: 'alone/moment.min.js.map',
        });
        copy.push({
          from: `${relative}node_modules/antd/dist/antd.min.css.map`,
          to: 'alone/antd.min.css.map',
        });
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
    const headScripts = [...(memo.headScripts || []), { src: 'init.js' }];

    return {
      ...memo,
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

// 提取图朴引用的js库名称
function extractJS() {
  const set = new Set();
  const filePath = resolve(__dirname, '../ht/storage');
  try {
    const files = readdirSync(filePath);

    files.forEach((filename) => {
      try {
        if (filename.endsWith('.html')) {
          const content = readFileSync(join(filePath, filename), 'utf-8');
          const matches = content.match(/\.\.\/libs\/ht-\w+\.js/g);
          if (Array.isArray(matches)) {
            matches.forEach((row) => {
              set.add(row.match(/ht-\w+\.js/)?.[0]);
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
