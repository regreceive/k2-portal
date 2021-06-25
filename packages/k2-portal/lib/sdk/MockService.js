'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require('react'));

  _react = function _react() {
    return data;
  };

  return data;
}

function _umi() {
  const data = require('umi');

  _umi = function _umi() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

const namespace = env.RUNTIME_NAMESPACE;

function observeRequest(_x) {
  return _observeRequest.apply(this, arguments);
} // 方便mock和真实接口切换

function _observeRequest() {
  _observeRequest = _asyncToGenerator(function* (req) {
    try {
      const response = yield req;
      return {
        err: null,
        res: response,
      };
    } catch (e) {
      return {
        err: e,
      };
    }
  });
  return _observeRequest.apply(this, arguments);
}

function adapt(host, url) {
  if (/^\/mock/.test(url)) {
    return url.replace('{namespace_name}', namespace).replace('/mock', '');
  }

  return host + url.replace('{namespace_name}', namespace);
}

class MockService {
  constructor(_host, _withDB = false) {
    this.host = void 0;
    this.withDB = void 0;

    this.get = (url) => {
      const host = this.host;
      const withDB = this.withDB;
      return {
        end: function end() {
          let nextUrl = url;

          if (withDB) {
            nextUrl = url + '&db={namespace_name}';
          }

          return observeRequest((0, _umi().request)(adapt(host, nextUrl)));
        },
      };
    };

    this.post = (url, data) => {
      const host = this.host;
      return {
        end: () => {
          return observeRequest(
            (0, _umi().request)(adapt(host, url), {
              method: 'POST',
              data,
            }),
          );
        },
      };
    };

    this.host = _host;
    this.withDB = _withDB;
  }
}

exports.default = MockService;
