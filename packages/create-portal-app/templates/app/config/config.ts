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
  publicPath: './',
  hash: true,
  routes,
  portal,
  dynamicImportSyntax: {},
  ignoreMomentLocale: true,
  proxy: proxy[(process.env.REACT_APP_ENV as 'dev') || 'dev'],
  plugins: ['k2-portal-plugin'],
});
