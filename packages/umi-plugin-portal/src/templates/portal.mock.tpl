import type { History } from 'umi';
import clone from 'lodash/clone';

type Config = {
  sso?: {
    clientId: string;
    clientUrl: string;
  };
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

const mockPortal =  {
  version: '{{{ version }}}',
  handleHistory: (history: History) => history,
  accessToken: '{{{ authorization }}}',
  config: freezeDeep<Config>(window.$$config),
  login: () => {},
  logout: () => {},
  openApp: (appKey: string, path: string = '/', replace?: boolean) => {},
  setAppIframe: (iframe: HTMLIFrameElement) => {},
  currAppKey: '',
  currAppUrl: '',
}

window.g_portal = mockPortal;

// @ts-ignore
export const portal = (parent.g_portal as typeof mockPortal) || mockPortal;
