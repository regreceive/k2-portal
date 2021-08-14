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
  webpack5: {},
  dynamicImportSyntax: {},
  ignoreMomentLocale: true,
  manifest: {},
  proxy: proxy[(process.env.REACT_APP_ENV as 'dev') || 'dev'],
});
