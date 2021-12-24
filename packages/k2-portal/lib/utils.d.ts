import React from 'react';
export declare function pickProps<P>(component: React.FC<P>): React.FC<P>;
/**
 * 当前应用是否是portal
 */
export declare const isPortal: any;
/**
 * 判断当前应用是否被其他应用引用，并且顶层应用是Portal
 */
export declare const isInPortal: boolean;
/**
 * 判断当前应用是否被其他应用引用。
 */
export declare const isInWidget: boolean;
/**
 * 取得应用自身的document
 */
export declare const doc: Document;
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
export declare function stringifyParamValue(key: string, value: string | number | any[]): string;
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
export declare function transformQuery(query: any): string;
