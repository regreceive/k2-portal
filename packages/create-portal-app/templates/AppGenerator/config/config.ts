import { defineConfig } from 'umi';
import routes from './router';
import proxy from './proxy';
import portal from './portal';

export default defineConfig({
  title: 'app',
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  base: '/app/',
  history: { type: 'hash' },
  publicPath: './', // 打包后./umi.js，而不是/umi.js
  hash: true,
  routes,
  plugins: ['k2-portal-plugin'],
  portal,
  dynamicImportSyntax: {},
  ignoreMomentLocale: true,
  proxy: proxy[(process.env.REACT_APP_ENV as 'dev') || 'dev'],
});
