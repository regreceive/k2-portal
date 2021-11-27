export default {
  dev: {
    '/nacos/': {
      target: 'http://192.167.2.11:8082',
      changeOrigin: true,
      // pathRewrite: { '^/nacos/': '/' },
    },
    '/repo/': {
      target: 'https://dfem.k2assets.k2/console/api/v2',
      changeOrigin: true,
      pathRewrite: { '^/repo/': '/' },
      secure: false,
    },
    '/data-service': {
      target: 'http://192.167.2.11:8082',
      changeOrigin: true,
    },
    '/bcf': {
      target: 'http://192.167.2.11:8082',
      changeOrigin: true,
    },
  },
};
