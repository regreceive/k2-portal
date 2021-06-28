export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [
    'wait-run-webpack-plugin',
    'umi-plugin-portal',
    'k2-portal',
    'create-portal-app',
  ],
};
