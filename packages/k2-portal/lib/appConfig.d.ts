/**
 * 取得应用配置
 * @param key 注册的应用名
 * @returns
 */
export declare function getAppConfig<T extends {}>(key: string): Promise<any>;
/**
 * 取得应用配置
 * @param key 注册的应用名
 * @param defaultConfig 默认配置
 * @param fn 返回结果处理
 * @returns
 */
export declare function useAppConfig<T>(key: string, defaultConfig: T, fn?: (config: any) => T): T;
/**
 * 获得定制列，并与本地列定义合并
 * @param key 注册的应用名
 * @param defaultColumns 默认列
 * @param fn 返回结果处理，会预置一个callback，将配置列、增强列与保留列合并
 * @returns
 */
export declare function useConfigColumns<T = any>(key: string, defaultColumns: T[], fn: (config: any, callback: (configColumns: T[], enhanceColumns: T[], optionColumns: T[]) => T[]) => T[]): T[];
