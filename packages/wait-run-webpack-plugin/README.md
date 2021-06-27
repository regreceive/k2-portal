# `wait-run-webpack-plugin`

For bundles that don't want to run instantly, unless revoke them manually.

## Usage

```js
const WaitRunWebpackPlugin = require('wait-run-webpack-plugin');
module.exports = {
  plugins: [new WaitRunWebpackPlugin({ test: /bundle\.js/ })],
};
```

## Run

```js
window.addEventListener('bundleReady', function (event) {
  event.detail.run();
});
```
