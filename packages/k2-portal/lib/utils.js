"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickProps = pickProps;
exports.mergeTimeSeries = mergeTimeSeries;
exports.log = log;
exports.warn = warn;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pickProps(component) {
  return component;
}
/**
 * 把多组时序通过时间索引，合并时序数据
 * @param series
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */


function mergeTimeSeries(...series) {
  const map = new Map();
  series.forEach((values, index) => {
    values.forEach(ts => {
      const value = map.get(ts[0]) || Array(series.length).fill(null);
      value[index] = ts[1];
      map.set(ts[0], value);
    });
  });
  return Array.from(map, v => {
    return [v[0], ...v[1]];
  });
}

function log(str) {
  console.log('%c' + str, 'font-size:14px;color:#666;text-shadow:1px 1px 2px #ccc;');
}

function warn(str) {
  console.log('warning: %c' + str, 'font-size:14px;color:#dd9900;text-shadow:1px 1px 2px #eee;');
}