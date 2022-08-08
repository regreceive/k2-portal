"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _less() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/less"));

  _less = function _less() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const schema = {
  title: 'haha loader options',
  type: 'object',
  properties: {
    scope: {
      description: 'root element your app based, allow class(.xxx) or id(#xxx)',
      anyOf: [{
        type: 'string'
      }]
    }
  }
};

function hahaLoader(_x, _x2, _x3) {
  return _hahaLoader.apply(this, arguments);
}

function _hahaLoader() {
  _hahaLoader = _asyncToGenerator(function* (content, map, meta) {
    // @ts-ignore
    const callback = this.async(); // @ts-ignore

    const options = this.getOptions(schema); // @ts-ignore

    if (this.resourcePath.endsWith('default.less')) {
      // .anticon是分界点
      const pos = content.indexOf('.anticon');

      if (pos < 0) {
        return callback(null, content, map, meta);
      }

      const globalCss = content.slice(0, pos);
      const restCss = content.slice(pos);
      const nextGlobalCss = globalCss.replace(/html(?= \[)/, '') // html [type="button"] => [type="button"]
      .replace(/html|body/g, 'hahahaha').replace(/(?=hahahaha)/, `.el-${options.scope} {`).replace(/hahahaha[^\{\}]*\{([^\}]*)\}/g, '$1') // html,body的样式分离出来
      .replaceAll('color: inherit;', ''); // 加scope以后，样式优先级变高，去掉一些不必要的属性
      // fs.writeFile('d:\\aa.less', nextGlobalCss + '}' + restCss, function (err) {
      //   console.log(err);
      // });

      const result = yield _less().default.render(nextGlobalCss + '}' + restCss);
      return callback(null, result.css, map, meta);
    }

    callback(null, content, map, meta);
  });
  return _hahaLoader.apply(this, arguments);
}

var _default = hahaLoader;
exports.default = _default;