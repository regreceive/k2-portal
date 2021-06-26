export default {
  dev: {
    '/nacos/': {
      target: 'http://dfem.k2assets.k2:8082',
      changeOrigin: true,
      // pathRewrite: { '^/nacos/': '/' },
    },
    '/data-service': {
      target: 'http://dfem.k2assets.k2:8082',
      changeOrigin: true,
    },
  },
};
