"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcast = broadcast;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _portal() {
  const data = require("@@/plugin-portal/portal");

  _portal = function _portal() {
    return data;
  };

  return data;
}

function _isPlainObject() {
  const data = _interopRequireDefault(require("lodash/isPlainObject"));

  _isPlainObject = function _isPlainObject() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 向所有应用发送数据
 * @param data 数据
 * @param opts 参数
 */
function broadcast(data, opts) {
  if (!(0, _isPlainObject().default)(data)) {
    throw 'data must be pattern of key/value';
  }

  _portal().portal._emit(data, _objectSpread({
    // @ts-ignore
    blockList: [window.$$config.id]
  }, opts));
}