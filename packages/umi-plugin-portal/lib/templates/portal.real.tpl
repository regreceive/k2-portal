import clone from 'lodash/clone';
import type { History } from 'umi';
import { history } from 'umi';
import { utils } from 'k2-portal';
import qs from 'query-string';
import SingleSign from './SingleSign';

type Config = {
  nacos: {
    /** 开启sso，其登录地址 */
    ssoAuthorityUrl: string;
    /** 服务配置 */
    service: any;
    /** 应用目录的绝对路径。比如 /web/apps */
    appRootPathName: string;
  };
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
   * @param appKey 应用路径，如果存在多级目录，用“.”连接
   * @param path 应用自己的路由
   * @param opts 
   * *路由选项*
   * - replace 是否替换路由，默认push路由
   * - layout 布局名称，entry根据名称切换布局，默认"app"
   */
  openApp: (
    appKey: string,
    path?: string,
    opts?: { replace?: boolean; layout?: string },
  ) => void;
  /**
   * @private 设置主应用iframe，设置以后iframe会被portal的openApp和history.listen控制。
   * 仅限portal内部组件使用，比如<Widget appRoot />
   * @param iframe iframe元素
   */
  setAppIframe: (iframe: HTMLIFrameElement) => void;
  /**
   * 返回entry的布局名称，entry可通过此项调整自身的布局设置，默认名称app
   */
  currLayout: string;
  /**
   * 返回当前应用的目录，这个目录是相对于nacos.appRootPathName，如果目录含有多级，则用“.”替代“/”
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
const getAccessToken = () => {
  return localStorage.getItem('k2_portal_token') || '';
};

let _rootAppChangeUrl: (url: string) => void;
// portal的完整路径：app/子应用路径.子应用名称/子应用路由
const portalMather = /^\/([\w\d\-]+)\/([^\/]+)(?:\/(\S*))?/;
// 登录
let signMgr: SingleSign;

// 封印，防止不讲究的代码
export const portal: GlobalPortalType = Object.defineProperties({} as GlobalPortalType, {
  version: {
    value: '{{{ version }}}',
  },
  handleHistory: {
    get() {
      return (appHistory: History, pathname: string) => {
        const appKey = pathname // out: /apps/widget/line/
          .replace(portal.config.nacos.appRootPathName, '') // out: /widget/line/
          .replace(/^\/+/, '') // out: widget/line/
          .replaceAll('/', '\.') // out: widget.line.
          .replace(/\.+$/, ''); // out: widget.line

        const fn = (arg: any, replace = false) => {
          if (portal.currAppKey === appKey) {
            // 确保只有当前主应用的history受控
            let path = '';
            if ( typeof arg === 'object' ) {
              const search = arg.query ? '?' + qs.stringify(arg.query) : '';
              path = arg.pathname + search;
            } else {
              path = arg;
            }
            portal.openApp(appKey, path, { replace });
          } else {
            appHistory._replace(arg);
          }
        };
          
        return Object.assign(appHistory, {
          _replace: appHistory.replace,
          push: (arg: any) => fn(arg),
          replace: (arg: any) => fn(arg, true),
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
      return () => {
        signMgr?.signIn()
      };
    },
  },
  logout: {
    get() {
      return () => {
        localStorage.removeItem('k2_portal_token');
        signMgr?.signOut();
      };
    },
  },
  openApp: {
    get() {
      return (appKey: string, path: string = '', opts = {}) => {
        const layout = opts.layout || portal.currLayout;
        const url = (`/${layout}/${appKey}/${path}`).replace(/\/{2,}/g, '/');
        if (history.location.pathname === url) {
          return;
        }
        if (opts.replace) {
          history.replace(url);
        } else {
          history.push(url);
        }
      };
    },
  },
  setRootAppChangeUrl: {
    get() {
      return (fn: (url: string) => void) => {
        _rootAppChangeUrl = fn;
      };
    },
  },
  currLayout: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_, layout] = result;
        return layout;
      }
      return 'app';
    }
  },
  currAppKey: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_, _1, appKey] = result;
        return appKey;
      }
      return '';
    }
  },
  currAppPath: {
    get() {
      const result = portalMather.exec(history.location.pathname);
      if (result) {
        const [_1, _2, _3, route] = result;
        return route;
      }
      return '';
    }
  },
  currAppUrl: {
    get() {
      const result = portalMather.exec(history.location.pathname + history.location.search);
      if (result) {
        const [_1, _2, appKey, path = '/'] = result;
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
history.listen((listener) => {
  if (!_rootAppChangeUrl) {
    utils.warn('请为当前portal或entry设置一个属性是appRoot的Widget');
    return;
  }
  const result = portalMather.exec(listener.pathname + listener.search);
  if (result) {
    const [_1, _2, appKey, path = ''] = result;
    const url = `${portal.config.nacos.appRootPathName}/${appKey.replaceAll(
      '.',
      '/',
    )}/#${path}`.replace(/\/{2,}/g, '/');

    _rootAppChangeUrl(url);
  }
});

window.g_portal = portal;

// 登录
(function () {
  debugger;
  if (process.env.NODE_ENV !== 'production' || getAccessToken()) {
    return;
  }
  if (portal.config.nacos.ssoAuthorityUrl) {
    signMgr = new SingleSign(
      portal.config.nacos.ssoAuthorityUrl, 
      location.origin + location.pathname,
    );

    if (location.search.startsWith('?code=')) {
      // 登录成功跳转，再去获取token
      signMgr.mgr.signinCallback().then((res) => {
        localStorage.setItem('k2_portal_token', res.access_token);
        // 去掉 ?code=
        location.replace(location.pathname);
      });
      return;
    }
    if (location.search.startsWith('?state=')) {
      location.replace(location.pathname);
    }
    
    portal.login();
  }
})();
