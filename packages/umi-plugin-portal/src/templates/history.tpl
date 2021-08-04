import { {{{ creator }}}, History } from '{{{ runtimePath }}}';

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
  let nextHistory = window.$$K2RootWindow?.$$_K2_SDK?.lib.utils.getHistory(self, history);

  if (nextHistory) {
    nextHistory.listen = history.listen;
  } else {
    nextHistory = history;
  }

  window.$$history = nextHistory;
  return nextHistory;
}

export { history };
