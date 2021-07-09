"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickProps = pickProps;
exports.mergeTimeSeries = mergeTimeSeries;
exports.log = log;
exports.warn = warn;
exports.FormatDateTime = FormatDateTime;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _moment() {
  const data = _interopRequireDefault(require("moment"));

  _moment = function _moment() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pickProps(component) {
  return component;
}
/**
 * 把多组时序通过时间索引，合并时序数据，如果时序之间时间不一样，则用null补齐空位
 * @param params
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */


function mergeTimeSeries(...params) {
  const map = new Map();
  let prevOffset = 0;
  const length = params.reduce((prev, curr) => {
    var _curr$0$length, _curr$;

    return prev + ((_curr$0$length = (_curr$ = curr[0]) === null || _curr$ === void 0 ? void 0 : _curr$.length) !== null && _curr$0$length !== void 0 ? _curr$0$length : 1) - 1;
  }, 0);
  const spacer = Array(length).fill(null);
  params.forEach(ts => {
    var _ts$0$length, _ts$;

    ts.forEach(series => {
      const init = map.get(series[0]) || spacer;
      const value = [...init.slice(0, prevOffset), ...series.slice(1), ...init.slice(prevOffset + series.length - 1)];
      map.set(series[0], value);
    });
    prevOffset += ((_ts$0$length = (_ts$ = ts[0]) === null || _ts$ === void 0 ? void 0 : _ts$.length) !== null && _ts$0$length !== void 0 ? _ts$0$length : 1) - 1;
  });
  return Array.from(map, v => {
    return [v[0], ...v[1]];
  });
}
/**
 * 日志输出
 *
 * @pam str 字符串
 */


function log(str) {
  console.log('%c' + str, 'font-size:14px;color:#666;text-shadow:1px 1px 2px #ccc;');
}
/**
 * 警告日志输出、
 * @param str 字符串
 */


function warn(str) {
  console.log('warning: %c' + str, 'font-size:14px;color:#dd9900;text-shadow:1px 1px 2px #eee;');
}

function FormatDateTime(value) {
  return (0, _moment().default)(value).format('YYYY-MM-DD HH:mm:ss');
}