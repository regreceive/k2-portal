/** 表查询 */
export declare const entity: {
  entityIds: string;
  attributes: string;
  param: string;
};
/** 量测实例 */
export declare const measurement: {
  searchName: string;
  searchDisplayName: string;
  pageSize: string;
  current: string;
};
/** 关联表查询 */
export declare const relation: {
  entityIds: string;
  attributes: string;
  relationTypes: string;
  param: string;
};
export declare const points: {
  code: string;
  name: string;
  displayName: string /** 设备名称搜索 */;
  pageSize: string;
  current: string;
};
/**
 * 解析param的值
 * @param key
 * @param value
 * @example stringifyParamValue('name', [1, 'bo'])  =>  name=1 or name='bo'
 */
export declare function stringifyParamValue(
  key: string,
  value: string | number | any[],
): string;
export default function transform(
  query:
    | {
        [key: string]: any;
        param?:
          | {
              [key: string]: any;
            }
          | undefined;
      }
    | undefined,
  map: {},
): string;
