import React from 'react';
export declare function pickProps<P>(component: React.FC<P>): React.FC<P>;
/**
 * 把多组时序通过时间索引，合并时序数据
 * @param series
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */
export declare function mergeTimeSeries(...series: any[][]): any[][];
export declare function log(str: string): void;
export declare function warn(str: string): void;
