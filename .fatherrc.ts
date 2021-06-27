export default {
  target: 'node',
  cjs: { type: 'babel', lazy: true },
  disableTypeCheck: true,
  pkgs: [
    'wait-run-webpack-plugin',
    'k2-portal',
    'umijs-plugin-portal',
    'create-portal-app',
  ],
};
