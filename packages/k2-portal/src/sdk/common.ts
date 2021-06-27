// @ts-nocheck
import { api } from '@@/plugin-portal/sdk';
import transform, * as transformQuery from './transformRequest';

type Convert<T, C> = {
  [P in keyof T]: C;
};
type ConvertRequest<T> = Partial<Convert<T, any>>;

interface Relation {
  attributes: { [key: string]: any };
  entity_id: number;
  data: Relation[];
}

/** 通用查表 */
export async function getInstance<T = any>(
  entityName: string,
  query?: ConvertRequest<typeof transformQuery.entity>,
) {
  return api.dataService.get<{ attributes: T }[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities?${transform(
      query,
      transformQuery.entity,
    )}`,
  );
}

/** 通用关联查表 */
export async function getRelation(
  entityName: string,
  query?: ConvertRequest<typeof transformQuery.relation>,
) {
  return api.dataService.get<Relation[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_via_relation_types?${transform(
      query,
      transformQuery.relation,
    )}`,
  );
}

/**
 * 通用sql查询
 * @param entityName
 * @param sql
 */
export async function getSql<T = any>(entityName: string, sql: string) {
  return api.dataService.get<{ attributes: T }[]>(
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_sql?sql=${escape(
      sql,
    )}`,
  );
}
