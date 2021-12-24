// @ts-ignore
import { portal } from '@@/plugin-portal/portal';

/**
 * 向所有应用发送数据
 * @param data 数据
 * @param tag 数据的标题，如果不是其它应用感兴趣的，会被过滤掉
 */
export function broadcast(data: Record<string, any>, tag: string) {
  if (!tag) {
    throw 'tag cannot be empty';
  }

  portal._broadcast(data, {
    // @ts-ignore
    blockList: [window.$$config.id],
    tag,
  });
}
