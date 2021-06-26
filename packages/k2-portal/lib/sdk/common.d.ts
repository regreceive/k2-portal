import { Convert } from '@@/plugin-portal/sdk';
import * as transformQuery from './transformRequest';
declare type ConvertRequest<T> = Partial<Convert<T, any>>;
/** 通用查表 */
export declare function getInstance<T = any>(entityName: string, query?: ConvertRequest<typeof transformQuery.entity>): Promise<any>;
/** 通用关联查表 */
export declare function getRelation(entityName: string, query?: ConvertRequest<typeof transformQuery.relation>): Promise<any>;
/**
 * 通用sql查询
 * @param entityName
 * @param sql
 */
export declare function getSql<T = any>(entityName: string, sql: string): Promise<any>;
export {};
