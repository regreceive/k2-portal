// @ts-ignore
import { getInstance } from '@@/plugin-portal/common';
import { useEffect, useState } from 'react';
import { warn } from './utils';

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
    warn('应用配置解析失败');
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
export function useAppConfig<T>(
  key: string,
  defaultConfig: T,
  fn?: (config: any) => T,
) {
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

      return [...mergedColumns, ...optionColumns];
    }
    getAppConfig(key).then((config) => {
      setColumns(fn(config, callback));
    });
  }, []);

  return columns;
}
