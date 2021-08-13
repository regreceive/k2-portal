import React from 'react';
export declare function pickProps<P>(component: React.FC<P>): React.FC<P>;
/**
 * 当前应用是否集成在portal中运行
 * @returns
 */
export declare const isInPortal: any;
/**
 * 把多组时序通过时间索引，合并时序数据，如果时序之间时间不一样，则用null补齐空位
 * @param params
 * @example mergeTimeSeries(ts1, ts2)
 * @return [[timestamp, v1, v2], [timestamp, v1, v2]]
 */
export declare function mergeTimeSeries(...params: any[][]): any[][];
/**
 * 日志输出
 *
 * @pam str 字符串
 */
export declare function log(str: string): void;
/**
 * 警告日志输出、
 * @param str 字符串
 */
export declare function warn(str: string): void;
export declare function formatDateTime(value: number | string): string;
