// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import { createHash } from 'crypto';
import { diffJson } from 'diff';
import { readdirSync, readFileSync } from 'fs';
import { EOL } from 'os';
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
        devAuth: {
          username: 'admin',
          password: 'f7da3686bd81225d9b35b6166efb0129',
        },
        role: 'app',
        customToken: '',
        interestedMessage: ['portal.theme'],
        declaredMessage: [],
        nacos: {
          default: {
            appRootPathName: '/web/apps',
            service: {
              gateway: '//fill_api_here',
              graphql: '//fill_api_here',
            },
          },
        },
      },
      schema(joi) {
        return joi.object({
          appDefaultProps: joi.object().description('应用服务化接受默认的传参'),
          devAuth: joi
            .object({
              username: joi.string().required(),
              password: joi.string().required(),
            })
            .description(
              '开发环境Basic认证，请求产品接口可以免登录通过BCF网关',
            ),
          interestedMessage: joi
            .array()
            .items(joi.string())
            .description('订阅感兴趣的消息字段，非订阅消息字段被过滤'),
          declaredMessage: joi
            .array()
            .items(joi.string())
            .description('声明消息字段，该字段消息被所有应用接收'),
          customToken: joi
            .string()
            .description(
              '自定义token，将覆盖http头部的Authorization，优先级高于devAuth。',
            ),
          role: joi
            .string()
            .pattern(/app|portal/, 'app|portal')
            .description('当前应用类型，是portal还是app'),
          nacos: joi
            .object({
              url: joi
                .string()
                .description('线上的nacos地址，如果不输入，会取default配置'),
              default: joi
                .object({
                  ssoAuthorityUrl: joi
                    .string()
                    .description('开启sso后的单点登录地址'),
                  customLoginApp: joi
                    .string()
                    .description(
                      '自定义登录应用key，如果与ssoAuthorityUrl同时开启，框架优先采纳单点登录的配置',
                    ),
                  appRootPathName: joi
                    .string()
                    .description(
                      "app根目录相对于web服务所在的路径，默认'/web/apps'",
                    ),
                  service: joi.object().description('服务'),
                })
                .description(
                  '默认nacos配置，可用于本地开发，如果配置了url则默认配置被覆盖',
                ),
            })
            .description('nacos配置'),
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
  // antd 主题自定义样式
  let antdThemes: string[] = [];

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
      nacos,
      appDefaultProps,
      devAuth,
      customToken,
      role,
      interestedMessage,
      declaredMessage,
    } = api.config?.portal ?? {};

    const antdPopContainerId =
      'pop-' +
      createHash('sha1').update(Math.random().toString()).digest('hex');

    let base64 = '';
    if (api.env !== 'production') {
      base64 =
        'Basic ' +
        Buffer.from(`${devAuth.username}:${devAuth.password}`).toString(
          'base64',
        );
    }

    const nextInterestedMessage = Array.from(
      new Set([...interestedMessage, 'portal.theme']),
    );
    // 生成portal.less
    api.writeTmpFile({
      path: 'plugin-portal/portal.less',
      content:
        api.env === 'development' || role === 'portal'
          ? readFileSync(join(__dirname, 'templates', 'portal.less'), 'utf-8')
          : '',
    });

    // 生成antd自定义主题.less
    if (antdThemes.length > 0) {
      const assets = readFileSync(
        join(__dirname, 'templates', 'antd.less'),
        'utf-8',
      );
      antdThemes.forEach((theme) => {
        api.writeTmpFile({
          path: `plugin-portal/${theme}.less`,
          content: [`@import '~@/antd-theme/${theme}.less';`, assets].join(EOL),
        });
      });
    }

    // 生成init.js
    api.writeTmpFile({
      path: 'plugin-portal/init.ts',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'init.tpl'), 'utf-8'),
        {
          antdPopContainerId,
          nacos: JSON.stringify(nacos.default, null, 4) || '{}',
          nacosUrl: nacos.url,
          antdThemes: JSON.stringify(antdThemes),
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

    if (role === 'portal') {
      // 生成单点登录sso.ts
      api.writeTmpFile({
        path: 'plugin-portal/SingleSign.ts',
        content: readFileSync(
          join(__dirname, 'templates', 'SingleSign.tpl'),
          'utf-8',
        ),
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
            `portal.${role === 'portal' ? 'real' : 'mock'}.tpl`,
          ),
          'utf-8',
        ),
        {
          basic: base64,
          declaredMessage: JSON.stringify(declaredMessage),
          version: require('../package').version,
        },
      ),
    });

    // 生成sdk.ts
    const interestStr = JSON.stringify(nextInterestedMessage);
    api.writeTmpFile({
      path: 'plugin-portal/sdk.ts',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'sdk.tpl'), 'utf-8'),
        {
          service: Object.keys(nacos.default.service),
          interestedMessage: interestStr,
          interestedMessageType: interestStr
            .replace(/","/g, '"|"')
            .replace(/\[|\]/g, ''),
        },
      ),
    });

    // 生成runtime
    api.writeTmpFile({
      path: 'plugin-portal/runtime.tsx',
      content: Mustache.render(
        readFileSync(join(__dirname, 'templates', 'runtime.tpl'), 'utf-8'),
        {
          antdPopContainerId,
          customToken,
          basic: base64,
          appDefaultProps: JSON.stringify(appDefaultProps),
          interestedMessage: interestStr,
        },
      ),
    });
  });

  // 阻止antd被优化加载，否则antd无法被externals
  api.modifyBabelPresetOpts((opts) => {
    const importList =
      opts.import?.filter((opt) => opt.libraryName !== 'antd') ?? [];
    importList.push({
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false,
    });

    return {
      ...opts,
      import: importList,
    };
  });

  // webpack额外配置
  api.chainWebpack((config) => {
    antdThemes.forEach((themeName) => {
      config
        .entry('theme-' + themeName)
        .add(
          path.resolve(
            api.paths.absTmpPath!,
            `plugin-portal/${themeName}.less`,
          ),
        );
    });

    // 阻止bundle载入后立即启动。具体控制在init.js中
    config
      .plugin('WaitRunWebpackPlugin')
      .use(WaitRunWebpackPlugin, [{ test: /umi(\.\w+)*\.?js$/ }]);

    config
      .entry('init')
      .add(path.resolve(api.paths.absTmpPath!, 'plugin-portal/init.ts'));

    config.optimization.set('runtimeChunk', 'single');

    config.module
      .rule('graphql')
      .test(/\.(gql|graphql)$/)
      .exclude.add(/node_modules/)
      .end()
      .use('graphql-modules')
      .loader(require.resolve('./graphql-loader'));

    // 确保打包输出不同的css名称，防止多应用样式冲突
    if (api.env === 'production') {
      const hashPrefix = Math.random().toString().slice(-5);
      config.module
        .rule('css')
        .oneOf('css-modules')
        .use('css-loader')
        .tap((options) => {
          return {
            ...options,
            modules: { ...options.modules, hashPrefix },
          };
        });

      config.module
        .rule('less')
        .oneOf('css-modules')
        .use('css-loader')
        .tap((options) => {
          return {
            ...options,
            modules: { ...options.modules, hashPrefix },
          };
        });
    }
    return config;
  });

  // 复制资源文件到输出目录
  api.modifyConfig((memo) => {
    try {
      const themeName = /[\w\d\-]+(?=\.less$)/;
      antdThemes = readdirSync(
        path.resolve(api.paths.absSrcPath!, 'antd-theme'),
      )
        .map((filename) => {
          const result = themeName.exec(filename);
          return result?.[0] ?? '';
        })
        .filter((filename) => filename);
    } catch {}

    const resourceName =
      api.env === 'development' ? 'development' : 'production.min';

    const root = path.resolve(
      dirname(require.resolve('react/package.json', { paths: [api.cwd] })),
      '../../',
    );

    const relative = winPath(path.relative(api.cwd, root) + '/');

    api.logger.info(`Copying directory: '${path.resolve(api.cwd, relative)}'`);

    const copy = [...(memo.copy || [])];

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
      ],
    );

    if (antdThemes.length === 0) {
      copy.push({
        from: `${relative}node_modules/antd/dist/antd.min.css`,
        to: 'alone/antd.css',
      });
    }

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
      );

      if (antdThemes.length === 0) {
        copy.push({
          from: `${relative}node_modules/antd/dist/antd.min.css.map`,
          to: 'alone/antd.min.css.map',
        });
      }
    }

    const esStyle = /^antd\/es\/[\w\-]+\/style/;
    const esModule = /^antd\/es\/([\w\-]+)$/;
    const linkedString = /\-(\w)/;
    const initials = /^\w/;

    const handle = function ({ request }: any, callback: any) {
      // 会有代码或依赖包直接引用antd中es样式，要排除其打包
      if (esStyle.test(request)) {
        return callback(null, 'undefined');
      }

      // antd/es/table/hooks/xxx可以打包
      // antd/es/table排除打包
      const match = esModule.exec(request);
      if (match) {
        callback(null, [
          'antd',
          match[1]
            .replace(linkedString, (_, $1) => $1.toUpperCase())
            .replace(initials, (letter) => letter.toUpperCase()),
        ]);
        return;
      }
      callback();
    };

    const externals = [
      {
        ...memo.externals,
        react: 'React',
        'react-dom': 'ReactDOM',
        moment: 'moment',
        antd: 'antd',
      },
      function (p1: any, p2: any, p3: any) {
        if (p1.request) {
          handle(p1, p2);
        } else {
          handle({ request: p2 }, p3);
        }
      },
    ];

    return {
      ...memo,
      runtimePublicPath: true,
      publicPath: './',
      hash: true,
      history: { type: 'hash' },
      chunks: ['runtime', 'init', 'umi'],
      externals: externals,
      antd: false,
      copy: api.env === 'test' ? memo.copy : copy,
      manifest: {},
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
