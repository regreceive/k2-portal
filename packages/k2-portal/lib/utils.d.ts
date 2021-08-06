import React from 'react';
export declare function pickProps<P>(component: React.FC<P>): React.FC<P>;
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
/**
 * 应用内打开其它app
 * @param opt
 */
export declare function openApp(opt: {
    /** appKey */
    appKey: string;
    /** 应用内部路由 */
    path: string;
    /** 路由是否replace模式 */
    isReplace?: boolean;
}): void;
