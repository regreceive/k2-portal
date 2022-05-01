export default {
  hash: true,
  title: 'k2-portal',
  mode: 'site',
  logo: '/logo.png',
  navs: [
    null,
    {
      title: 'Demo',
      path: 'https://k2-portal-demo.vercel.app/',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/regreceive/k2-portal',
    },
    // { title: '更新日志', path: 'https://github.com/umijs/dumi/releases' },
  ],

  exportStatic: {},
  sitemap: {
    hostname: 'https://d.umijs.org',
  },
  copy: [
    {
      from: 'docs/assets/logo3.png',
      to: 'logo.png',
    },
    'docs/assets/favicon.ico',
  ],
};
