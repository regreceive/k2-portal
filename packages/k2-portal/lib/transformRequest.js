"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyParamValue = stringifyParamValue;
exports.transformQuery = transformQuery;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _isNil() {
  const data = _interopRequireDefault(require("lodash/isNil"));

  _isNil = function _isNil() {
    return data;
  };

  return data;
}

function _queryString() {
  const data = _interopRequireDefault(require("query-string"));

  _queryString = function _queryString() {
    return data;
  };

  return data;
}

const _excluded = ["param", "current", "pageSize"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * 解析param的值
 * @param key
 * @param value
 * @example
 *   stringifyParamValue('name', ['$range', 1, 2])
 *   result: name>=1 and name<=2
 *
 *   stringifyParamValue('name', ['$or', 1, 2])
 *   result: name=1 or name=2
 *
 *   stringifyParamValue('name', ['$and', 1, 2])
 *   result: name=1 and name=2
 *
 *   stringifyParamValue('name', [1, 2])
 *   result: name=1 or name=2
 */
function stringifyParamValue(key, value) {
  if (Array.isArray(value)) {
    if (value.length === 3 && '$range' === value[0]) {
      return typeof value[1] === 'string' ? `${key}>='${value[1]}' and ${key}<='${value[2]}'` : `${key}>=${value[1]} and ${key}<=${value[2]}`;
    }

    if (['$and', '$or'].includes(value[0])) {
      const nextValue = value.slice(1).map(row => stringifyParamValue(key, row));
      return nextValue.join(` ${value[0].slice(1)} `);
    }

    const nextValue = value.map(row => stringifyParamValue(key, row));
    return nextValue.join(' or ');
  }

  if (typeof value === 'string') {
    return `${key}='${value}'`;
  }

  return `${key}=${value}`;
}
/**
 * 对query进行序列化，转化antd表格组件的页码请求
 * @param query
 * @example
 *   // reference to stringifyParamValue
 *   transform({
 *    param: { a: 1, b: [2, 3] },
 *    page: 1
 *   })
 *   result: param=a=1|b=2 or b=3&page=1
 */


function transformQuery(query) {
  const _query$param = query.param,
        param = _query$param === void 0 ? {} : _query$param,
        page_num = query.current,
        page_size = query.pageSize,
        restQuery = _objectWithoutProperties(query, _excluded);

  const nextParam = Object.entries(param).map(([paramName, paramValue]) => {
    if ((0, _isNil().default)(paramValue) || paramValue === '') {
      return undefined;
    }

    return stringifyParamValue(paramName, paramValue);
  }).filter(row => row).join('|');
  return _queryString().default.stringify(_objectSpread(_objectSpread({}, restQuery), {}, {
    param: nextParam || undefined,
    page_num,
    page_size
  }));
}