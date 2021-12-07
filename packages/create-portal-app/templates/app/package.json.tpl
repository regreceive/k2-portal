{
  "private": true,
  "name": "portal-app",
  "scripts": {
    "start": "umi dev",
    "build": "umi build",
    "postinstall": "umi generate tmp",
    "prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
    "test": "umi-test",
    "test:coverage": "umi-test --coverage"
  },
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,less,md,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "prettier --parser=typescript --write"
    ]
  },
  "dependencies": {
    "@ant-design/pro-layout": "^6.5.0",
    "@apollo/client": "^3.5.5",
    "@umijs/preset-react": "1.x",
    "graphql": "^16.0.1",
    "k2-portal": "^{{{ version }}}",
    "oidc-client": "^1.11.5",
    "umi": "^3.5.20"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.170",
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@umijs/test": "^3.5.20",
    "lint-staged": "^10.0.7",
    "prettier": "^2.2.0",
    "react": "17.x",
    "react-dom": "17.x",
    "typescript": "^4.1.2",
    "umi-plugin-portal": "^{{{ version }}}",
    "yorkie": "^2.0.0"
  }
}
