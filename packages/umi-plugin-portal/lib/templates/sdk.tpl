/**
 * 模拟portal的sdk，用于当前子应用独立运行
 */
import MockService from './MockService';
import { History } from 'umi';

declare global {
  interface Window {
    $$K2RootWindow: PortalWindow | Window;
    $$config: { [key: string]: any };
  }
}

interface PortalWindow extends Window {
  $$_K2_SDK: {};
}

type Convert<T, C> = {
  [P in keyof T]: C;
};

export interface ResponseData<T = any> {
  code?: number;
  data?: T;
  results?: {
    series?: {
      tags: { node_id: string; [key: string]: string };
      values: any[];
    }[];
  }[];
  body?: {
    items: {
      k_ts: number;
      k_device: string;
      [key: string]: number;
    }[];
  }
}

interface PortalResponseData {
  err: null | Error;
  res: ResponseData;
}

interface SemiService {
  get: <T = any>(url: string) => Promise<ResponseData<T>>;
  post: <T = any>(url: string, data: any) => Promise<ResponseData<T>>;
}

export type AppMapType = {
  alone: boolean;
  appType: string;
  category: string;
  key: string;
  label: string;
  url: string;
};

const mockSDK = {
  lib: {
    utils: {
      service: {
        {{{ service }}}
      },
      getHistory: (win: Window, history: History): History => history,
    },
  },
  config: {
    // @ts-ignore
    value: { ...window.$$config },
  },
};

function proxyFact(service: MockService) {
  const proxyMethod = ['get', 'post'];
  return new Proxy(service, {
    get(target: MockService, p: string) {
      if (proxyMethod.includes(p)) {
        return (...args: any[]) => {
          return Reflect.apply(Reflect.get(target, p), target, args)
            .end()
            .then((response: PortalResponseData) => {
              return Promise.resolve(response?.res ?? {});
            });
        };
      }
      return Reflect.get(target, p);
    },
  });
}

let defaultSDK: typeof mockSDK;
try {
  // https禁止这样访问
  defaultSDK = (<PortalWindow>window.$$K2RootWindow)
    .$$_K2_SDK as typeof mockSDK;
} catch (_) {
  defaultSDK = mockSDK;
}

defaultSDK = defaultSDK || mockSDK;

type SemiServiceList = Convert<
  typeof defaultSDK.lib.utils.service,
  SemiService
>;

export const sdk = defaultSDK;
export const portalWindow = window.$$K2RootWindow;
export const api = Object.entries(defaultSDK.lib.utils.service).reduce(
  (prev, [key, value]) => {
    return { ...prev, [key]: proxyFact(value) };
  },
  {} as SemiServiceList,
);
