/**
 * 建模器通用查表，如果不够请补充
 */
import { useState, useEffect } from 'react';
import { api } from './sdk';
import { transformQuery, warn } from 'k2-portal';

type ResponseInstance = {
  attributes: any;
  entity_id: number;
}

interface ResponseRelation {
  attributes: { [key: string]: any };
  entity_id: number;
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
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities?${transformQuery(
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
    `/data/namespaces/{namespace_name}/entity_types/${entityName}/entities_via_relation_types?${transformQuery(
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

let cacheAppConfig = new Map();
/**
 * 取得应用配置
 * @param key 注册的应用名
 * @returns 
 */
export async function getAppConfig<T extends {}>(key: string) {
  if (cacheAppConfig.has(key)) {
    return cacheAppConfig.get(key);
  }
  
  const res = await getInstance('bcf_ui_config', {
    param: { key },
    attributes: 'value',
  });
  const text = res.data?.[0].attributes.value ?? '{}';

  try {
    cacheAppConfig.set(key, eval('(' + text + ')'));
  } catch {
    warn('应用配置解析失败')
    cacheAppConfig.set(key, {});
  }

  return cacheAppConfig.get(key) as T;
}

/**
 * 取得应用配置
 * @param key 注册的应用名
 * @param defaultConfig 默认配置
 * @param fn 返回结果处理
 * @returns
 */
export function useAppConfig<T>(key: string, defaultConfig: T, fn?: (config: any) => T) {
  const [config, setConfig] = useState<T>(defaultConfig);
  useEffect(() => {
    getAppConfig<T>(key).then((c) => {
      setConfig(fn?.(c) ?? c);
    });
  }, []);
  return config as T;
}

/**
 * 获得定制列，并与本地列定义合并
 * @param key 注册的应用名
 * @param defaultColumns 默认列
 * @param fn 返回结果处理，会预置一个callback，将配置列、增强列与保留列合并
 * @returns 
 */
export function useConfigColumns<T = any>(
  key: string,
  defaultColumns: T[],
  fn: (
    config: any,
    callback: (
      configColumns: T[],
      enhanceColumns: T[],
      optionColumns: T[],
    ) => T[],
  ) => T[],
) {
  const [columns, setColumns] = useState(defaultColumns);

  useEffect(() => {
    /**
     *
     * @param configColumns 配置的columns
     * @param enhanceColumns 增强的columns，可以额外增加配置的columns的属性
     * @param optionColumns 保留的columns，比如操作列
     * @returns
     */
    function callback(
      configColumns: T[],
      enhanceColumns: T[],
      optionColumns: T[],
    ) {      
      const mergedColumns = configColumns.map((column) => {
        return {
          // @ts-ignore
          ...enhanceColumns.find((c) => c.dataIndex === column.dataIndex),
          ...column,
        };
      });

      return [
        ...mergedColumns,
        ...optionColumns,
      ];
    }
    getAppConfig(key).then((config) => {
      setColumns(fn(config, callback));
    });
  }, []);

  return columns;
}