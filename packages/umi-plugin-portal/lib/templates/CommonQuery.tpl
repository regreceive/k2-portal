/**
 * 建模器通用查表，如果不够请补充
 */
import { api } from './sdk';
import { utils } from 'k2-portal';

type ResponseInstance = {
  attributes: any;
  entity_id: number;
}

interface ResponseRelation {
  attributes: { [key: string]: any };
  entity_id: number;
  relationship_id: number;
  relation_type: string;
  data: ResponseRelation[];
}

/** 表查询 */
type RequestEntity = {
  entity_ids: number;
  attributes: string;
  param: {
    [key: string]: boolean | string | number | string[] | number[];
  };
};

/** 关联表查询 */
type RequestRelation = RequestEntity & {
  relationTypes: string;
};

/**
 * 通用单表查询
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export async function getInstance(
  entityName: string,
  query?: Partial<RequestEntity>,
) {
  return api.dataService.get<ResponseInstance[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities?${utils.transformQuery(
      query,
    )}`,
  );
}

/**
 * 通用关联查表
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export async function getRelation(
  entityName: string,
  query?: Partial<RequestRelation>,
) {
  return api.dataService.get<ResponseRelation[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_via_relation_types?${utils.transformQuery(
      query,
    )}`,
  );
}

/**
 * 通用sql查询
 * @param entityName 表名称
 * @param sql 查询语句
 */
export async function getSql<T = any>(entityName: string, sql: string) {
  return api.dataService.get<{ attributes: T }[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_sql?sql=${escape(
      sql,
    )}`,
  );
}
