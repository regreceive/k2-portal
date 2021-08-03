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
