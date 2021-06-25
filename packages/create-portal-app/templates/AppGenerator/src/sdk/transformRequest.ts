/**
 * 请求查询参数转换入口，防止接口变动
 */
import mapKeys from 'lodash/mapKeys';
import qs from 'query-string';
import isNil from 'lodash/isNil';

/** 表查询 */
export const entity = {
  entityIds: 'entity_ids',
  attributes: 'attributes',
  param: 'param',
};

/** 量测实例 */
export const measurement = {
  searchName: 'search_name',
  searchDisplayName: 'search_display_name',
  pageSize: 'page_size',
  current: 'page_num',
};

/** 关联表查询 */
export const relation = {
  entityIds: 'entity_ids',
  attributes: 'attributes',
  relationTypes: 'relation_types',
  param: 'param',
};

export const points = {
  code: 'code',
  name: 'name',
  displayName: 'display_name' /** 设备名称搜索 */,
  pageSize: 'page_size',
  current: 'page_num',
};

/**
 * 解析param的值
 * @param key
 * @param value
 * @example stringifyParamValue('name', [1, 'bo'])  =>  name=1 or name='bo'
 */
export function stringifyParamValue(key: string, value: string | number | any[]): string {
  if (Array.isArray(value)) {
    const nextValue = value.map(row => stringifyParamValue(key, row));
    return nextValue.join(' or ');
  }
  // if (typeof value === 'string') {
    return `${key}='${value}'`;
  // }
  // return `${key}=${value}`;
}

export default function transform(
  query: { param?: { [key: string]: any }; [key: string]: any } = {},
  map: {},
) {
  const { param = {}, ...restQuery } = query;

  // param对表字段进行检索，输出格式为param=a=1|b='str'
  const nextParam = Object.entries(param)
    .map(([paramName, paramValue]) => {
      if (isNil(paramValue) || paramValue === '') {
        return undefined;
      }
      return stringifyParamValue(paramName, paramValue);
    })
    .filter(row => row)
    .join('|');

  return qs.stringify({
    ...mapKeys(restQuery, (value: string, key: string) => {
      if (!map.hasOwnProperty(key)) {
        console.warn(`[transform_request]: not match key '${key}'`);
      }
      return Reflect.get(map, key) || key;
    }),
    param: nextParam || undefined,
  });
}
