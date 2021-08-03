"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppConfig = getAppConfig;
exports.useAppConfig = useAppConfig;
exports.useConfigColumns = useConfigColumns;

function _react() {
  const data = _interopRequireWildcard(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _common() {
  const data = require("@@/plugin-portal/common");

  _common = function _common() {
    return data;
  };

  return data;
}

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

let cacheAppConfig = new Map();
/**
 * 取得应用配置
 * @param key 注册的应用名
 * @returns
 */

function getAppConfig(_x) {
  return _getAppConfig.apply(this, arguments);
}
/**
 * 取得应用配置
 * @param key 注册的应用名
 * @param defaultConfig 默认配置
 * @param fn 返回结果处理
 * @returns
 */


function _getAppConfig() {
  _getAppConfig = _asyncToGenerator(function* (key) {
    var _res$data$0$attribute, _res$data;

    if (cacheAppConfig.has(key)) {
      return cacheAppConfig.get(key);
    }

    const res = yield (0, _common().getInstance)('bcf_ui_config', {
      param: {
        key
      },
      attributes: 'value'
    });
    const text = (_res$data$0$attribute = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data[0].attributes.value) !== null && _res$data$0$attribute !== void 0 ? _res$data$0$attribute : '{}';

    try {
      cacheAppConfig.set(key, eval('(' + text + ')'));
    } catch (_unused) {
      (0, _utils.warn)('应用配置解析失败');
      cacheAppConfig.set(key, {});
    }

    return cacheAppConfig.get(key);
  });
  return _getAppConfig.apply(this, arguments);
}

function useAppConfig(key, defaultConfig, fn) {
  const _useState = (0, _react().useState)(defaultConfig),
        _useState2 = _slicedToArray(_useState, 2),
        config = _useState2[0],
        setConfig = _useState2[1];

  (0, _react().useEffect)(() => {
    getAppConfig(key).then(c => {
      var _fn;

      setConfig((_fn = fn === null || fn === void 0 ? void 0 : fn(c)) !== null && _fn !== void 0 ? _fn : c);
    });
  }, []);
  return config;
}
/**
 * 获得定制列，并与本地列定义合并
 * @param key 注册的应用名
 * @param defaultColumns 默认列
 * @param fn 返回结果处理，会预置一个callback，将配置列、增强列与保留列合并
 * @returns
 */


function useConfigColumns(key, defaultColumns, fn) {
  const _useState3 = (0, _react().useState)(defaultColumns),
        _useState4 = _slicedToArray(_useState3, 2),
        columns = _useState4[0],
        setColumns = _useState4[1];

  (0, _react().useEffect)(() => {
    /**
     *
     * @param configColumns 配置的columns
     * @param enhanceColumns 增强的columns，可以额外增加配置的columns的属性
     * @param optionColumns 保留的columns，比如操作列
     * @returns
     */
    function callback(configColumns, enhanceColumns, optionColumns) {
      const mergedColumns = configColumns.map(column => {
        return _objectSpread(_objectSpread({}, enhanceColumns.find(c => c.dataIndex === column.dataIndex)), column);
      });
      return [...mergedColumns, ...optionColumns];
    }

    getAppConfig(key).then(config => {
      setColumns(fn(config, callback));
    });
  }, []);
  return columns;
}