/**
 * 向所有应用发送数据
 * @param data 数据
 * @param tag 数据的标题，如果不是其它应用感兴趣的，会被过滤掉
 */
export declare function broadcast(data: Record<string, any>, tag: string): void;
