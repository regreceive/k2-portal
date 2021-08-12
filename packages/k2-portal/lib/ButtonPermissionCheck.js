"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useButtonPermissionCheck = useButtonPermissionCheck;
exports.ButtonPermissionCheck = void 0;

var _sdk = require("@@/plugin-portal/sdk");

var _react = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

var _excluded = ["forbiddenFieldProps", "accessKey"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function mergeHierarchy(data) {
  return data.reduce(function (prev, curr) {
    if (curr.parent_id === 0) {
      var perm = {
        appKey: curr.name,
        operations: data.filter(function (item) {
          return item.parent_id === curr.id;
        }).map(function (item) {
          return item.name;
        })
      };
      return [].concat(_toConsumableArray(prev), [[curr.name, perm]]);
    }

    return prev;
  }, []);
}

var isInitial = false;
var cache = Promise.resolve(new Map());

function getPurview() {
  return _getPurview.apply(this, arguments);
}

function _getPurview() {
  _getPurview = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _purview$isEnable;

    var _sdk$lib$central$user5, _sdk$lib$central$user6, purview;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!_utils.isInPortal) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", (_sdk$lib$central$user5 = (_sdk$lib$central$user6 = _sdk.sdk.lib.central.userInfo.boxState.purview) === null || _sdk$lib$central$user6 === void 0 ? void 0 : _sdk$lib$central$user6.permission) !== null && _sdk$lib$central$user5 !== void 0 ? _sdk$lib$central$user5 : new Map());

          case 2:
            if (!isInitial) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", cache);

          case 4:
            purview = _sdk.sdk.lib.central.userInfo.boxState.purview;

            if ((_purview$isEnable = purview === null || purview === void 0 ? void 0 : purview.isEnable) !== null && _purview$isEnable !== void 0 ? _purview$isEnable : false) {
              cache = _sdk.api.gateway.get('/bcf-basic-ms/role/getUserAppPermission').then(function (res) {
                var _res$data$map, _res$data;

                var init = mergeHierarchy((_res$data$map = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.map(function (row) {
                  return row.attributes;
                })) !== null && _res$data$map !== void 0 ? _res$data$map : []);
                return new Map(init);
              });
            }

            return _context.abrupt("return", cache);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getPurview.apply(this, arguments);
}

var ButtonPermissionCheck = function ButtonPermissionCheck(props) {
  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      forbidden = _useState2[0],
      setForbidden = _useState2[1];

  (0, _react.useEffect)(function () {
    var _sdk$lib$central$user, _sdk$lib$central$user2;

    if (!((_sdk$lib$central$user = (_sdk$lib$central$user2 = _sdk.sdk.lib.central.userInfo.boxState.purview) === null || _sdk$lib$central$user2 === void 0 ? void 0 : _sdk$lib$central$user2.isEnable) !== null && _sdk$lib$central$user !== void 0 ? _sdk$lib$central$user : false)) {
      setForbidden(false);
      return;
    }

    getPurview().then(function (map) {
      var _map$get$operations$i, _map$get;

      var permitted = (_map$get$operations$i = (_map$get = map.get(_sdk.appKey)) === null || _map$get === void 0 ? void 0 : _map$get.operations.includes(props.accessKey)) !== null && _map$get$operations$i !== void 0 ? _map$get$operations$i : false;
      setForbidden(!permitted);
    });
  }, [props.accessKey]);
  var childrenWithProps = (0, _react.useMemo)(function () {
    var forbiddenFieldProps = props.forbiddenFieldProps,
        accessKey = props.accessKey,
        rest = _objectWithoutProperties(props, _excluded);

    return _react.default.Children.map(props.children, function (child) {
      if (forbidden && /*#__PURE__*/_react.default.isValidElement(child)) {
        return /*#__PURE__*/_react.default.cloneElement(child, _objectSpread(_objectSpread({}, props.forbiddenFieldProps), rest));
      }

      return child;
    });
  }, [forbidden, props.deps]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, childrenWithProps);
};

exports.ButtonPermissionCheck = ButtonPermissionCheck;

function useButtonPermissionCheck(accessKey) {
  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      allow = _useState4[0],
      setAllow = _useState4[1];

  (0, _react.useEffect)(function () {
    var _sdk$lib$central$user3, _sdk$lib$central$user4;

    if (!((_sdk$lib$central$user3 = (_sdk$lib$central$user4 = _sdk.sdk.lib.central.userInfo.boxState.purview) === null || _sdk$lib$central$user4 === void 0 ? void 0 : _sdk$lib$central$user4.isEnable) !== null && _sdk$lib$central$user3 !== void 0 ? _sdk$lib$central$user3 : false)) {
      setAllow(true);
      return;
    }

    getPurview().then(function (map) {
      var _map$get$operations$i2, _map$get2;

      var allow = (_map$get$operations$i2 = (_map$get2 = map.get(_sdk.appKey)) === null || _map$get2 === void 0 ? void 0 : _map$get2.operations.includes(accessKey)) !== null && _map$get$operations$i2 !== void 0 ? _map$get$operations$i2 : false;
      setAllow(allow);
    });
  }, [accessKey]);
  return allow;
}