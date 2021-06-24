export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: ['wait-run-webpack-plugin', 'umijs-plugin-portal', 'create-portal-app'],
};
