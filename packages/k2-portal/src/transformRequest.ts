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
