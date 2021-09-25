import { createHashHistory, createMemoryHistory, createBrowserHistory, History } from '{{{ runtimePath }}}';
import { getPortal } from '@@/plugin-portal/portal';

let options = {{{ options }}};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

// remove initial history because of ssr
let history: History = process.env.__IS_SERVER ? null : wrapHistory({{{ creator }}}(options));
export const createHistory = (hotReload = false) => {
  if (!hotReload) {
    switch(options.type){
      case 'memory':
        history = createMemoryHistory(options);
        break;
      case 'hash':
        history = createHashHistory(options);
        break;
      case 'browser':
        history = createBrowserHistory(options);
        break;
      default:
        history = {{{ creator }}}(options);
    }
  }

  return wrapHistory(history);
};

// 通常仅微前端场景需要调用这个 API
export const setCreateHistoryOptions = (newOpts: any = {}) => {
  options = { ...options, ...newOpts };
};

// 获取 history options 运行时配置
export const getCreateHistoryOptions = () => options;

function wrapHistory(history) {
  const nextHistory = getPortal().handleHistory(history,  self.location.pathname);

  window.$$history = nextHistory;
  return nextHistory;
}

export { history };
