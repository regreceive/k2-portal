import React from 'react';

export function pickProps<P>(component: React.FC<P>) {
  return component;
}

/**
 * 把多组时序通过时间索引，合并时序数据
 * @param series
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */
export function mergeTimeSeries(...series: any[][]) {
  const map = new Map();
  series.forEach((values, index) => {
    values.forEach((ts) => {
      const value = map.get(ts[0]) || Array(series.length).fill(null);
      value[index] = ts[1];
      map.set(ts[0], value);
    });
  });

  return Array.from(map, (v) => {
    return [v[0], ...v[1]];
  });
}
