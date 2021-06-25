import { api, Convert } from '@/sdk';
import transform, * as transformQuery from '@/sdk/transformRequest';

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

/** 通用influxdb时序数据查询 **/
export async function getInfluxdb(sql: string) {
  return api.influxdb.get('/query?q=' + sql);
}

/** 工况数据 */
export async function getSummary(id: string) {
  return api.gateway.get(`/mock/api/summary?id=${id}`);
}
