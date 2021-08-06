// @ts-ignore
import { sdk } from '@@/plugin-portal/sdk';
import moment from 'moment';
import React from 'react';

export function pickProps<P>(component: React.FC<P>) {
  return component;
}

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
 * 应用内打开其它app
 * @param opt
 */
export function openApp(opt: {
  /** appKey */
  appKey: string;
  /** 应用内部路由 */
  path: string;
  /** 路由是否replace模式 */
  isReplace?: boolean;
}) {
  sdk.lib.utils.openApp({ isReplace: false, ...opt }, null);
}
