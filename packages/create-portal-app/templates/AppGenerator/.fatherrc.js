import hashbang from 'rollup-plugin-hashbang';

export default {
  entry: 'bin/setup.js',
  cjs: {
    type: 'rollup',
  },
  extraExternals: ['util', 'fs', 'child_process', 'path'],
  target: 'node',
  extraRollupPlugins: [hashbang()],
};
