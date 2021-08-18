// @ts-nocheck
import { getInstance } from '@@/plugin-portal/common';
import { appKey } from '@@/plugin-portal/sdk';
import { useEffect, useState } from 'react';
import { warn } from './utils';

let cacheAppConfig = new Map<string, Promise<any>>();

/**
 * 取得应用配置
 * @param key 注册的应用名
 * @returns
 */
export async function getAppConfig<T extends {} = any>(
  key: string = appKey,
): Promise<T> {
  if (cacheAppConfig.has(key)) {
    const value = await cacheAppConfig.get(key);
    return value;
  }

  const promise = getInstance('bcf_ui_config', {
    param: { key },
    attributes: 'value',
  }).then((res: any) => {
    const text = res.data?.[0].attributes.value ?? '{}';
    try {
      const json = eval('(' + text + ')');
      return json;
    } catch {
      warn(`应用[${key}]配置解析失败`);
      return {};
    }
  });

  cacheAppConfig.set(key, promise);
  return await promise;
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
 * @param callback 获得应用配置回调
 * @param deps 依赖项
 * @returns
 */
export function useConfigColumns<T = any>(
  callback: (config: any) => T[],
  deps: any[] = [],
) {
  const [columns, setColumns] = useState<T[]>([]);

  useEffect(() => {
    getAppConfig(appKey).then((config) => {
      setColumns(callback(config));
    });
  }, deps);

  return columns;
}
