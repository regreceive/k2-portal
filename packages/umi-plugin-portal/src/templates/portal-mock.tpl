import type { History } from 'umi';

type Config = {
  sso?: {
    clientId: string;
    clientUrl: string;
  };
};


const mockPortal =  {
  version: '',
  handleHistory: (history: History) => history,
  accessToken: '{{{ authorization }}}',
  config: {} as Config,
  login: () => {},
  logout: () => {},
  openApp: (appKey: string, path: string, replace?: boolean) => {},
  shareHistory: (appKey: string, iframe: HTMLIFrameElement) => {},
  setAppIframe: (iframe: HTMLIFrameElement) => {},
}

// @ts-ignore
export const getPortal = () =>
  (top.g_portal as typeof mockPortal) || mockPortal;
