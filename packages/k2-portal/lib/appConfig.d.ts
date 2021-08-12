/**
 * 取得应用配置
 * @param key 注册的应用名
 * @returns
 */
export declare function getAppConfig<T extends {}>(key: string): Promise<T>;
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
 * @param callback 获得应用配置回调
 * @param deps 依赖项
 * @returns
 */
export declare function useConfigColumns<T = any>(callback: (config: any) => T[], deps?: any[]): T[];
