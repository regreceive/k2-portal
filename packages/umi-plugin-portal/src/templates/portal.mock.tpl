import type { History } from 'umi';
import clone from 'lodash/clone';

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
   * @param replace 是否替换路由，默认push路由
   */ 
  openApp: (appKey: string, path?: string, replace?: boolean) => void;
  /**
   * @private 设置主应用iframe，设置以后iframe会被portal的openApp和history.listen控制。
   * 仅限portal内部组件使用，比如<Widget appRoot />
   * @param iframe iframe元素
   */
  setAppIframe: (iframe: HTMLIFrameElement) => void;
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

const mockPortal: GlobalPortalType =  {
  version: '{{{ version }}}',
  handleHistory: (history: History) => history,
  accessToken: '{{{ authorization }}}',
  config: freezeDeep<Config>(window.$$config),
  login: () => {},
  logout: () => {},
  openApp: (appKey: string, path: string = '/', replace?: boolean) => {},
  setAppIframe: (iframe: HTMLIFrameElement) => {},
  currAppKey: '',
  currAppPath: '',
  currAppUrl: '',
}

export const portal = parent.g_portal as GlobalPortalType || mockPortal;
