declare type Options = {
    /** 是否缓存到portal中，新接入应用第一时间接收到消息 */
    persist: boolean;
};
/**
 * 向所有应用发送数据
 * @param data 数据
 * @param opts 参数
 */
export declare function broadcast(data: Record<string, any>, opts: Options): void;
export {};
