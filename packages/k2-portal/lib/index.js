"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require("./sdk/common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _common[key];
    }
  });
});

var _transformRequest = require("./sdk/transformRequest");

Object.keys(_transformRequest).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _transformRequest[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transformRequest[key];
    }
  });
});