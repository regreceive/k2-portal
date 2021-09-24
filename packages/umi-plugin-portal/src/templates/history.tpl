import { {{{ creator }}}, History } from '{{{ runtimePath }}}';
import { portal } from '@@/plugin-portal/portal';

let options = {{{ options }}};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

// remove initial history because of ssr
let history: History = process.env.__IS_SERVER ? null : wrapHistory({{{ creator }}}(options));
export const createHistory = (hotReload = false) => {
  return history;
};

function wrapHistory(history) {
  const nextHistory = portal.handleHistory(history, '{{{ appKey }}}');
  window.$$history = nextHistory;
  return nextHistory;
}

export { history };
