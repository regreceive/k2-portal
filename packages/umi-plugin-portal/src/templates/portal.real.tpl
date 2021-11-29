import clone from 'lodash/clone';
import type { History } from 'umi';
import { history } from 'umi';
import { utils } from 'k2-portal';
import sso from './sso';

type Config = {
  sso: {
    clientId: string;
    clientUrl: string;
  };
  appPath: string;
};

type GlobalPortalType = {
  /** 当前Portal版本号 */
  version: string;
  handleHistory: (history: History) => History;
  /** 
   * @private 登录后的token
   */
  accessToken: string;
  /** nacos配置，也有一些portal内部配置 */
  config: Config;
  /** 登录 */
  login: () => void;
  /** 登出 */
  logout: () => void;
  /**
   * 应用间跳转
   * @param appKey 应用路径，如果存在多级目录，用“-”连接
   * @param path 应用自己的路由
   * @param replace 是否替换路由，默认push路由
   */ 
  openApp: (appKey: string, path?: string, replace?: boolean) => {};
  /**
   * @private 设置主应用iframe，设置以后iframe会被portal的openApp和history.listen控制。
   * 仅限portal内部组件使用，比如<Widget appRoot />
   * @param iframe iframe元素
   * 
  setAppIframe: (iframe: HTMLIFrameElement) => {};
  /**
   * 返回当前应用的目录，这个目录是相对于config.appPath，如果目录含有多级，则用“.”替代“/”
   * @example /web/portal/app/myapp/#/list => 'myapp'
   */
  currAppKey: string;
  /**
   * 返回当前应用的路由级别的path
   * @example /web/portal/app/myapp/#/list?page=1 => '/list?page=1'
   */
  currAppPath: string;
  /**
   * 返回当前应用的路径，包含应用自身的路由
   * @example /web/portal/app/myapp/#/list?page=1 => '/myapp/#/list?page=1'
   */
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
// portal的完整路径：app/子应用路径.子应用名称/子应用路由
const portalMather = /^\/app\/([^\/]+)(?:\/(\S*))?/;

// 封印，防止不讲究的代码
export const portal: GlobalPortalType = Object.defineProperties({} as GlobalPortalType, {
  version: {
    value: '{{{ version }}}',
  },
  handleHistory: {
    get() {
      return (appHistory: History, pathname: string) => {
        const appPathname = pathname // out: /apps/widget/line/
          .replace(portal.config.appPath, '') // out: /widget/line/
          .replace(/^\//, '') // 去掉第一个反斜杠 out: widget/line/
          .replaceAll('/', '\.') // out: widget.line.
          .replace(/\.$/, ''); // out: widget.line
          
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
    get() {
      sso.signIn;
    },
  },
  logout: {
    get() {
      sso.signOut;
    },
  },
  openApp: {
    get() {
      /**
        * 应用间跳转
        * @param appKey 应用路径，如果存在多级目录，用“.”连接
        * @param path 应用自己的路由
        * @param replace 是否跳转
        */
      return (appKey: string, path: string = '', replace = false) => {
        const url = ('/app/' + appKey + '/' + path).replace(/\/{2,}/g, '/');
        if (history.location.pathname === url) {
          return;
        }
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
  currAppPath: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_1, _2, route] = result;
        return route;
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
          return `/${appKey.replaceAll('.', '/')}/#${path}`.replace(
            /\/{2,}/g,
            '/',
          );
        }
      }
      return '';
    },
  },
});

// 主应用路由
const appMatcher = new RegExp('(?<=' + portal.config.appPath + '/).*');
history.listen((listener) => {
  if (!_appIframe) {
    utils.warn('请为当前portal或entry设置一个属性是appRoot的Widget');
    return;
  }
  const result = portalMather.exec(listener.pathname);
  if (result) {
    const [_, appKey, path = '/'] = result;
    const url = `${portal.config.appPath}/${appKey.replaceAll(
      '.',
      '/',
    )}/#/${path}`.replace(/\/{2,}/g, '/');

    _appIframe.src = url;
  }
});

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
