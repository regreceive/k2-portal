import isNil from 'lodash/isNil';
import moment from 'moment';
import qs from 'query-string';
import React from 'react';

export function pickProps<P>(component: React.FC<P>) {
  return component;
}

/**
 * 当前应用是否是portal
 */
// @ts-ignore
export const isPortal = () => window === OwnWindow && !!window.g_portal;

/**
 * 判断当前应用是否被其他应用引用，并且顶层应用是Portal
 */
// @ts-ignore
export const isInPortal = () => window !== OwnWindow && !!window.g_portal;

/**
 * 判断当前应用是否被其他应用引用。
 */
export const isInWidget = () =>
  // @ts-ignore
  window !== OwnWindow && !window?.g_portal && !!window.$$config;

/**
 * 取得应用自身的document
 */
// @ts-ignore
export const doc = ownWindow.document;

/**
 * 把多组时序通过时间索引，合并时序数据，如果时序之间时间不一样，则用null补齐空位
 * @param params
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */
export function mergeTimeSeries(...params: any[][]) {
  const map = new Map();
  let prevOffset = 0;
  const length = params.reduce(
    (prev, curr) => prev + (curr[0]?.length ?? 1) - 1,
    0,
  );
  const spacer = Array(length).fill(null);

  params.forEach((ts) => {
    ts.forEach((series) => {
      const init = map.get(series[0]) || spacer;
      const value = [
        ...init.slice(0, prevOffset),
        ...series.slice(1),
        ...init.slice(prevOffset + series.length - 1),
      ];

      map.set(series[0], value);
    });
    prevOffset += (ts[0]?.length ?? 1) - 1;
  });

  return Array.from(map, (v) => {
    return [v[0], ...v[1]];
  });
}

/**
 * 日志输出
 *
 * @pam str 字符串
 */
export function log(str: string) {
  console.log(
    '%c' + str,
    'font-size:14px;color:#666;text-shadow:1px 1px 2px #ccc;',
  );
}

/**
 * 警告日志输出、
 * @param str 字符串
 */
export function warn(str: string) {
  console.log(
    'warning: %c' + str,
    'font-size:14px;color:#dd9900;text-shadow:1px 1px 2px #eee;',
  );
}

export function formatDateTime(value: number | string) {
  return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '--';
}

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
export function stringifyParamValue(
  key: string,
  value: string | number | any[],
): string {
  if (Array.isArray(value)) {
    if (value.length === 3 && '$range' === value[0]) {
      return typeof value[1] === 'string'
        ? `${key}>='${value[1]}' and ${key}<='${value[2]}'`
        : `${key}>=${value[1]} and ${key}<=${value[2]}`;
    }
    if (['$and', '$or'].includes(value[0])) {
      const nextValue = value
        .slice(1)
        .map((row) => stringifyParamValue(key, row));
      return nextValue.join(` ${value[0].slice(1)} `);
    }
    if ('$like' === value[0]) {
      return value
        .slice(1)
        .map((row) => {
          return `${key} like \'%${row}%\'`;
        })
        .join(' or ');
    }
    const nextValue = value.map((row) => stringifyParamValue(key, row));
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
export function transformQuery(query: any) {
  const {
    param = {},
    current: page_num,
    pageSize: page_size,
    ...restQuery
  } = query;

  const nextParam = Object.entries(param)
    .map(([paramName, paramValue]) => {
      if (isNil(paramValue) || paramValue === '') {
        return undefined;
      }
      return stringifyParamValue(paramName, paramValue as any);
    })
    .filter((row) => row)
    .join('|');

  return qs.stringify({
    ...restQuery,
    param: nextParam || undefined,
    page_num,
    page_size,
  });
}
