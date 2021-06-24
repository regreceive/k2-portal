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
  window.$$k2App = {
    replace: history.replace,
    push: history.push,
  };

  let nextHistory = window.$$K2RootWindow?.$$_K2_SDK?.lib.utils.getHistory(window, history);
  if (nextHistory) {
    console.log("%cPortal接管history\n", "color:#666;text-shadow:1px 1px 2px #999;");
  } else {
    nextHistory = history;
  }

  window.$$history = nextHistory;
  return nextHistory;
}

export { history };
