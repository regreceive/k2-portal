// @ts-ignore
import { portal } from '@@/plugin-portal/portal';
import isPlainObject from 'lodash/isPlainObject';

type Options = {
  /** 是否缓存到portal中，新接入应用第一时间接收到消息 */
  persist: boolean;
};

/**
 * 向所有应用发送数据
 * @param data 数据
 * @param opts 参数
 */
export function broadcast(data: Record<string, any>, opts: Options) {
  if (!isPlainObject(data)) {
    throw 'data must be pattern of key/value';
  }

  portal._emit(data, {
    // @ts-ignore
    blockList: [window.$$config.id],
    ...opts,
  });
}
