/**
 * 模拟portal的sdk，用于当前子应用独立运行
 */
import { createContext, useContext } from 'react';
import { History } from 'umi';
import MockService from './MockService';

interface PortalWindow extends Window {
  $$_K2_SDK: {};
}

type Convert<T, C> = {
  [P in keyof T]: C;
};

export interface ResponseData<T> {
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
      // @ts-ignore
      k_device: string;
      [key: string]: number;
    }[];
    deviceIds: string[];
    all: {
      name: string;
      type: string;
    }[];
    exist: {
      name: string;
      type: string;
    }[];
    [key: string]: any;
  }
}

interface PortalResponseData {
  err: null | Error;
  res: ResponseData<any>;
}

interface SemiService {
  get: <T = any>(url: string) => Promise<ResponseData<T>>;
  post: <T = any>(url: string, data: any) => Promise<ResponseData<T>>;
}

export type AppMapValueType = {
  alone: boolean;
  appType: string;
  category: string;
  key: string;
  label: string;
  url: string;
};

type ServiceType = {
  {{#service}}
  {{.}}: MockService;
  {{/service}}
};

// @ts-ignore
const service: ServiceType = Object.entries(window.$$config.service)
  .reduce((prev, [key, value]) => {
    return {...prev, [key]: new MockService(value as string)};
  }, {});

let appMap = new Map<string, AppMapValueType>();

const mockSDK = {
  lib: {
    utils: {
      service,
      getHistory: (win: Window, history: History): History => history,
    },
    central: {
      appConfig: {
        state: appMap,
      },
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
              // bobo写死了服务返回数据解析(封装到依赖包里了)，如果解析失败就返回res，所以需要重新返回res.body
              // @ts-ignore
              if (response.res?.req) {                
                return Promise.resolve(response.res.body);
              }
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

/**
 * 应用之间传递传递参数，通过此context接收数据
 */
export const AppContext = createContext<any>({{{ appDefaultProps }}});

/**
 * 接收app入参
 *
 * @param initialProps 默认app传参值
 */
export function useAppProps<T>() {
  return useContext<T>(AppContext);
}