/**
 * 请求查询参数转换入口，防止接口变动
 */
import isNil from 'lodash/isNil';
import qs from 'query-string';

/**
 * 解析param的值
 * @param key
 * @param value
 * @example
 *   stringifyParamValue('name', [1, 'bo'])
 *   result: name=1 or name='bo'
 */
export function stringifyParamValue(
  key: string,
  value: string | number | any[],
): string {
  if (Array.isArray(value)) {
    const nextValue = value.map((row) => stringifyParamValue(key, row));
    return nextValue.join(' or ');
  }
  // if (typeof value === 'string') {
  return `${key}='${value}'`;
  // }
  // return `${key}=${value}`;
}

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
export function transformQuery(query: { param?: { [key: string]: any } } = {}) {
  const { param = {}, ...restQuery } = query;

  const nextParam = Object.entries(param)
    .map(([paramName, paramValue]) => {
      if (isNil(paramValue) || paramValue === '') {
        return undefined;
      }
      return stringifyParamValue(paramName, paramValue);
    })
    .filter((row) => row)
    .join('|');

  return qs.stringify({
    ...restQuery,
    param: nextParam || undefined,
  });
}
