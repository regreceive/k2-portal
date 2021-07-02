/**
 * 解析param的值
 * @param key
 * @param value
 * @example
 *   stringifyParamValue('name', [1, 'bo'])
 *   result: name=1 or name='bo'
 */
export declare function stringifyParamValue(key: string, value: string | number | any[]): string;
/**
 * 对query进行序列化
 * @param query
 * @example
 *   transform({
 *    param: { a: 1, b: [2, 3] },
 *    page: 1
 *   })
 *   result: param=a=1|b=2 or b=3&page=1
 */
export default function transform(query?: {
    param?: {
        [key: string]: any;
    };
}): string;
