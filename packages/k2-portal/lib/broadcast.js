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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore

/**
 * 向所有应用发送数据
 * @param data 数据
 * @param tag 数据的标题，如果不是其它应用感兴趣的，会被过滤掉
 */
function broadcast(data, tag) {
  if (!tag) {
    throw 'tag cannot be empty';
  }

  _portal().portal._broadcast(data, {
    // @ts-ignore
    blockList: [window.$$config.id],
    tag
  });
}