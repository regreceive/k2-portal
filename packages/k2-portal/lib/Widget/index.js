"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _usePrevious = _interopRequireDefault(require("ahooks/es/usePrevious"));

var _antd = require("antd");

var _classnames = _interopRequireDefault(require("classnames"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _ = require("../");

var _utils = require("../utils");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Widget = function Widget(props) {
  var frame = (0, _react.useRef)(null);
  var link = (0, _react.useRef)(null);
  var bodyRef = (0, _react.useRef)(null);
  var previous = (0, _usePrevious.default)(props.appProps);

  var _useState = (0, _react.useState)(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var iframeUrl = (0, _react.useMemo)(function () {
    // 作为主应用，url受控
    if (props.appRoot) {
      var url = _.portal.config.appPath + _.portal.currAppUrl;

      if (url) {
        return url;
      }
    }

    var targetUrl = (_.portal.config.appPath + '/' + props.src).replace(/\/{2,}/g, '/');

    if (props.src === '' || props.src.includes('#') || props.src.endsWith('/')) {
      return targetUrl;
    }

    return targetUrl + '/';
  }, [props.src, props.appRoot]);
  var renderApp = (0, _react.useCallback)(function () {
    var _frame$current, _frame$current$conten, _frame$current$conten2;

    // 有可能来自appProps的更新，此时iframe还没有加载完页面造成没有renderChildApp这个函数
    // @ts-ignore
    (_frame$current = frame.current) === null || _frame$current === void 0 ? void 0 : (_frame$current$conten = _frame$current.contentWindow) === null || _frame$current$conten === void 0 ? void 0 : (_frame$current$conten2 = _frame$current$conten.renderChildApp) === null || _frame$current$conten2 === void 0 ? void 0 : _frame$current$conten2.call(_frame$current$conten, bodyRef.current, props.appProps);
  }, [props.appProps, iframeUrl]); // 应用的props更新，进行一次渲染

  (0, _react.useEffect)(function () {
    var _frame$current2;

    var appWindow = (_frame$current2 = frame.current) === null || _frame$current2 === void 0 ? void 0 : _frame$current2.contentWindow;
    if (!appWindow) return;

    if (props.appProps && !(0, _isEqual.default)(props.appProps, previous)) {
      renderApp();
    }
  }, [props.appProps]);
  (0, _react.useEffect)(function () {
    if (props.appRoot) {
      _.portal.setAppIframe(frame.current);
    }
  }, [props.appRoot]);
  var moveCSS = (0, _react.useCallback)(function () {
    var _frame$current3, _frame$current3$conte, _frame$current3$conte2;

    var url = (_frame$current3 = frame.current) === null || _frame$current3 === void 0 ? void 0 : (_frame$current3$conte = _frame$current3.contentDocument) === null || _frame$current3$conte === void 0 ? void 0 : (_frame$current3$conte2 = _frame$current3$conte.querySelector('link[href$=".css"]')) === null || _frame$current3$conte2 === void 0 ? void 0 : _frame$current3$conte2.href;

    if (url) {
      var _link$current;

      var ele = (_link$current = link.current) === null || _link$current === void 0 ? void 0 : _link$current.ownerDocument.createElement('link');

      if (ele) {
        var _link$current2;

        ele.href = url;
        ele.type = 'text/css';
        ele.rel = 'stylesheet';
        (_link$current2 = link.current) === null || _link$current2 === void 0 ? void 0 : _link$current2.appendChild(ele);
      }
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    "data-name": "widget",
    style: _objectSpread({
      height: '100%'
    }, props.style),
    className: (0, _classnames.default)('k2-umi-widget', props.className)
  }, /*#__PURE__*/_react.default.createElement("div", {
    "data-name": "style",
    ref: link
  }), /*#__PURE__*/_react.default.createElement("iframe", {
    ref: frame,
    onLoad: function onLoad() {
      try {
        var _frame$current4, _frame$current4$conte;

        // about: blank也会触发onload，这里判断一下
        if (((_frame$current4 = frame.current) === null || _frame$current4 === void 0 ? void 0 : (_frame$current4$conte = _frame$current4.contentWindow) === null || _frame$current4$conte === void 0 ? void 0 : _frame$current4$conte.location.host) !== '') {
          setLoading(false);
          moveCSS();
          renderApp();
        }
      } catch (e) {
        var _frame$current5;

        (0, _utils.warn)("Widget.src[".concat((_frame$current5 = frame.current) === null || _frame$current5 === void 0 ? void 0 : _frame$current5.src, "]\n\u5B50\u5E94\u7528\u8DE8\u57DF\u4E86\uFF0C\u8FD4\u56DE403\u3001404\u9519\u8BEF\u90FD\u4F1A\u5BFC\u81F4\u8DE8\u57DF\u3002"));
      }
    },
    src: iframeUrl,
    style: {
      display: 'none'
    }
  }), /*#__PURE__*/_react.default.createElement(_antd.Spin, {
    spinning: loading
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: '100%'
    },
    ref: bodyRef
  })));
};

var _default = Widget;
exports.default = _default;