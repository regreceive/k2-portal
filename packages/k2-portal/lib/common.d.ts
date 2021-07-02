/**
 * 建模器通用查表，如果不够请补充
 */
/** 表查询 */
declare type RequestEntity = {
    entity_ids: number;
    attributes: string;
    param: {
        [key: string]: string | number | string[] | number[];
    };
};
/** 关联表查询 */
declare type RequestRelation = RequestEntity & {
    relationTypes: string;
};
/**
 * 通用单表查询
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export declare function getInstance<T = any>(entityName: string, query?: Partial<RequestEntity>): Promise<any>;
/**
 * 通用关联查表
 * @param entityName 表名称
 * @param query 查询对象
 * @returns
 */
export declare function getRelation(entityName: string, query?: Partial<RequestRelation>): Promise<any>;
/**
 * 通用sql查询
 * @param entityName 表名称
 * @param sql 查询语句
 */
export declare function getSql<T = any>(entityName: string, sql: string): Promise<any>;
export {};
