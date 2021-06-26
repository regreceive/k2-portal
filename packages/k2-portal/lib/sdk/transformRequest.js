'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.stringifyParamValue = stringifyParamValue;
exports.default = transform;
exports.points =
  exports.relation =
  exports.measurement =
  exports.entity =
    void 0;

function _react() {
  const data = _interopRequireDefault(require('react'));

  _react = function _react() {
    return data;
  };

  return data;
}

function _isNil() {
  const data = _interopRequireDefault(require('lodash/isNil'));

  _isNil = function _isNil() {
    return data;
  };

  return data;
}

function _mapKeys() {
  const data = _interopRequireDefault(require('lodash/mapKeys'));

  _mapKeys = function _mapKeys() {
    return data;
  };

  return data;
}

function _queryString() {
  const data = _interopRequireDefault(require('query-string'));

  _queryString = function _queryString() {
    return data;
  };

  return data;
}

const _excluded = ['param'];

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

/** 表查询 */
const entity = {
  entityIds: 'entity_ids',
  attributes: 'attributes',
  param: 'param',
};
/** 量测实例 */

exports.entity = entity;
const measurement = {
  searchName: 'search_name',
  searchDisplayName: 'search_display_name',
  pageSize: 'page_size',
  current: 'page_num',
};
/** 关联表查询 */

exports.measurement = measurement;
const relation = {
  entityIds: 'entity_ids',
  attributes: 'attributes',
  relationTypes: 'relation_types',
  param: 'param',
};
exports.relation = relation;
const points = {
  code: 'code',
  name: 'name',
  displayName: 'display_name',
  /** 设备名称搜索 */
  pageSize: 'page_size',
  current: 'page_num',
};
/**
 * 解析param的值
 * @param key
 * @param value
 * @example stringifyParamValue('name', [1, 'bo'])  =>  name=1 or name='bo'
 */

exports.points = points;

function stringifyParamValue(key, value) {
  if (Array.isArray(value)) {
    const nextValue = value.map((row) => stringifyParamValue(key, row));
    return nextValue.join(' or ');
  } // if (typeof value === 'string') {

  return `${key}='${value}'`; // }
  // return `${key}=${value}`;
}

function transform(query = {}, map) {
  const _query$param = query.param,
    param = _query$param === void 0 ? {} : _query$param,
    restQuery = _objectWithoutProperties(query, _excluded); // param对表字段进行检索，输出格式为param=a=1|b='str'

  const nextParam = Object.entries(param)
    .map(([paramName, paramValue]) => {
      if ((0, _isNil().default)(paramValue) || paramValue === '') {
        return undefined;
      }

      return stringifyParamValue(paramName, paramValue);
    })
    .filter((row) => row)
    .join('|');
  return _queryString().default.stringify(
    _objectSpread(
      _objectSpread(
        {},
        (0, _mapKeys().default)(restQuery, (value, key) => {
          if (!map.hasOwnProperty(key)) {
            console.warn(`[transform_request]: not match key '${key}'`);
          }

          return Reflect.get(map, key) || key;
        }),
      ),
      {},
      {
        param: nextParam || undefined,
      },
    ),
  );
}
