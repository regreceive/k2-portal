// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { readdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import WaitRunWebpackPlugin from 'wait-run-webpack-plugin';

export default function (api: IApi) {
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
  });

  // 生成init.js
  api.onGenerateFiles(() => {
    const { service, nacos } = api.config?.portal ?? {};
    const initTpl = readFileSync(join(__dirname, 'init.tpl'), 'utf-8');
    // 生成初始化portal的js
    api.writeTmpFile({
      path: join('plugin-portal/init.js'),
      content: Mustache.render(initTpl, {
        service: JSON.stringify(service, null, 4) || {},
        nacos,
      }),
    });
  });

  api.onGenerateFiles(() => {
    const historyTpl = readFileSync(
      join(
        __dirname,
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

    // runtime，提供根节点上下文
    api.writeTmpFile({
      path: 'plugin-portal/runtime.tsx',
      content: readFileSync(join(__dirname, 'runtime.tpl'), 'utf-8'),
    });
  });

  // Runtime Plugin
  api.addRuntimePlugin(() => [
    join(api.paths.absTmpPath!, 'plugin-portal/runtime.tsx'),
  ]);

  // 阻止antd被优化加载，否则antd无法被externals
  api.modifyBabelPresetOpts((opts) => {
    const list = opts.import?.filter((opt) => opt.libraryName !== 'antd') ?? [];

    return {
      ...opts,
      import: list,
    };
  });

  // 复制资源文件到输出目录
  api.modifyConfig((memo) => {
    const resourceName =
      api.env === 'development' ? 'development' : 'production.min';

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
    }

    // 引用init.js
    const headScripts = [...(memo.headScripts || []), { src: 'init.js' }];

    return {
      ...memo,
      antd: false,
      copy,
      headScripts,
      define: { ...memo.define, ...runtimeEnv() },
    };
  });

  api.chainWebpack((config) => {
    const prevConfig = config.toConfig();
    // react react-dom antd作为全局资源，不会被打入bundle中
    config.externals([
      {
        ...(prevConfig.externals as {}),
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
        moment: 'window.moment',
        antd: 'window.antd',
      },
      function (context: any, request: string, callback: any) {
        const match = /^antd\/es\/(\w+)$/.exec(request);
        if (match) {
          callback(null, 'antd.' + match[1]);
          return;
        }
        callback();
      },
    ]);

    config
      // 阻止bundle载入后立即启动。具体控制在init.js中
      .plugin('WaitRunWebpackPlugin')
      .use(WaitRunWebpackPlugin, [{ test: /umi\.\w*\.?js$/ }])
      .end();

    return config;
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
