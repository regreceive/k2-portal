export default {
  hash: true,
  title: 'k2portal',
  mode: 'site',
  logo: '/logo.png',
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/umijs/dumi' },
    { title: '更新日志', path: 'https://github.com/umijs/dumi/releases' },
  ],

  exportStatic: {},
  sitemap: {
    hostname: 'https://d.umijs.org',
  },
  copy: [
    {
      from: 'docs/assets/logo.png',
      to: 'logo.png',
    },
  ],
};
