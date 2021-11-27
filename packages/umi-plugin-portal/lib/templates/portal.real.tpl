import clone from 'lodash/clone';
import type { History } from 'umi';
import { history } from 'umi';
import sso from './sso';

type Config = {
  sso: {
    clientId: string;
    clientUrl: string;
  };
  appPath: string;
};

type GlobalType = {
  version: string;
  handleHistory: (history: History) => History;
  accessToken: string;
  config: Config;
  login: () => void;
  logout: () => void;
  openApp: (appKey: string, path: string, replace?: boolean) => {};
  setAppIframe: (iframe: HTMLIFrameElement) => {};
  currAppKey: string;
  currAppUrl: string;
};

// 深度冷冻对象
function freezeDeep<T>(obj: any): T {
  const freezeObject = Object.keys(obj).reduce<T>((prev, curr) => {
    if (Object.prototype.toString.call(obj[curr]) === '[object Object]') {
      return { ...prev, [curr]: freezeDeep(clone(obj[curr])) };
    }
    if (Array.isArray(obj[curr])) {
      return { ...prev, [curr]: Object.freeze(obj[curr]) };
    }
    return { ...prev, [curr]: obj[curr] };
  }, {} as T);

  return Object.freeze<T>(freezeObject);
}

// 用户token
let _accessToken: any = '';
const getAccessToken = () => {
  if (_accessToken === '') {
    _accessToken = localStorage.getItem('token');
  }
  return _accessToken;
};

let _appIframe: HTMLIFrameElement;

// 封印，防止不讲究的代码
export const portal: GlobalType = Object.defineProperties({} as GlobalType, {
  version: {
    value: '{{{ version }}}',
  },
  handleHistory: {
    get() {
      return (appHistory: History, pathname: string) => {
        const appPathname = pathname // out: /apps/widget/line/
          .replace(portal.config.appPath, '') // out: /widget/line/
          .replace(/^\//, '') // 去掉第一个反斜杠 out: widget/line/
          .replaceAll('/', '-') // out: widget-line-
          .replace(/\-$/, ''); // out: widget-line
          
        return Object.assign(appHistory, {
          push: (arg: any) => {
            const path =
              typeof arg === 'object' ? arg.pathname + arg.search : arg;
            portal.openApp(appPathname, path);
          },
          replace: (arg: any) => {
            const path =
              typeof arg === 'object' ? arg.pathname + arg.search : arg;
            portal.openApp(appPathname, path, true);
          },
        });
      };
    },
  },
  accessToken: {
    get: () => '{{{ basic }}}' || 'Bearer ' + getAccessToken(),
  },
  config: {
    value: freezeDeep<Config>(window.$$config),
  },
  login: {
    enumerable: false,
    get() {
      sso.signIn();
    },
  },
  logout: {
    enumerable: false,
    get() {
      sso.signOut();
    },
  },

  openApp: {
    get() {
      /**
        * 应用间跳转
        * @param appKey 应用路径，如果存在多级目录，用“-”连接
        * @param path 应用自己的路由
        * @param replace 是否跳转
        */ 
      return (appKey: string, path: string = '', replace = false) => {
        const url =
          '/app/' + appKey + (path.startsWith('/') ? path : '/' + path);
        if (replace) {
          history.replace(url);
        } else {
          history.push(url);
        }
      };
    },
  },
  setAppIframe: {
    get() {
      return (iframe: HTMLIFrameElement) => {
        _appIframe = iframe;
      };
    },
  },
  // 返回当前运行appKey
  currAppKey: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_, appKey] = result;
        return appKey;
      }
      return '';
    }
  },
  currAppUrl: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_, appKey, path = '/'] = result;
        const url = location.href;
        if (url) {
          return `/${appKey.replaceAll('-', '/')}/#${path}`.replace(
            '//',
            '/',
          );
        }
      }
      return '';
    },
  },
});

// portal的完整路径：app/子应用路径-子应用名称/子应用路由
const portalMather = /^\/app\/([^\/]+)(?:\/(\S*))?/;
// 主应用路由
const appMatcher = new RegExp('(?<=' + portal.config.appPath + '/).*');
history.listen((listener) => {
  const result = portalMather.exec(listener.pathname);
  if (result) {
    const [_, appKey, path = '/'] = result;
    const url = _appIframe.contentWindow?.location.href;
    if (url) {
      _appIframe.contentWindow?.location.replace(
        url
          .replace(appMatcher, `/${appKey.replaceAll('-', '/')}/#/${path}`)
          // 去重2个反斜杠
          .replace(/(?<!:)\/{2}/g, '/'),
        );
    }
  }
});

export const getPortal = () => portal;

window.g_portal = portal;

// 登录
if (process.env.NODE_ENV !== 'development' && window.$$config.sso && !getAccessToken()) {
  if (location.search.startsWith('?code=')) {
    // 登录成功跳转
    sso.signInCallback(history.replace);
    sso.getAcessToken().then(res => {
      localStorage.setItem('token', res);
    });
  } else {
    sso.signIn();
  }
}
