"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInstance = getInstance;
exports.getRelation = getRelation;
exports.getSql = getSql;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _sdk() {
  const data = require("@@/plugin-portal/sdk");

  _sdk = function _sdk() {
    return data;
  };

  return data;
}

var _transformRequest = _interopRequireDefault(require("./transformRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * 通用单表查询
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
function getInstance(_x, _x2) {
  return _getInstance.apply(this, arguments);
}
/**
 * 通用关联查表
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */


function _getInstance() {
  _getInstance = _asyncToGenerator(function* (entityName, query) {
    return _sdk().api.dataService.get(`/data/namespaces/{namespace_name}/entity_types/${entityName}/entities?${(0, _transformRequest.default)(query)}`);
  });
  return _getInstance.apply(this, arguments);
}

function getRelation(_x3, _x4) {
  return _getRelation.apply(this, arguments);
}
/**
 * 通用sql查询
 * @param entityName 表名称
 * @param sql 查询语句
 */


function _getRelation() {
  _getRelation = _asyncToGenerator(function* (entityName, query) {
    return _sdk().api.dataService.get(`/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_via_relation_types?${(0, _transformRequest.default)(query)}`);
  });
  return _getRelation.apply(this, arguments);
}

function getSql(_x5, _x6) {
  return _getSql.apply(this, arguments);
}

function _getSql() {
  _getSql = _asyncToGenerator(function* (entityName, sql) {
    return _sdk().api.dataService.get(`/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_sql?sql=${escape(sql)}`);
  });
  return _getSql.apply(this, arguments);
}