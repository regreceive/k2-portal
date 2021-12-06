import { createContext, useContext } from 'react';
import { request } from 'umi';

type CommonServiceType = {
  get: (url: string) => Promise<ResponseData>;
  post: {
    /**
     * @param data 发送的消息体
     */
    (data: {}): Promise<ResponseData>;
    /**
     * @param pathname 相对地址
     * @param data 发送的消息体
     */
    (pathname: string, data: {}): Promise<ResponseData>;
  };
};

type ServiceListType = {
  {{#service}}
  {{.}}: CommonServiceType;
  {{/service}}
};

/** 应用的上下文 */
export const AppContext = createContext<any>({});

/**
 * 返回父级应用传入的属性
 */
export function useAppProps<T>() {
  return useContext<T>(AppContext);
}

const spaceMatcher = /(?<=#graphql\n)\s+/;
function prettyGql(gql: string) {
  const result = spaceMatcher.exec(gql);
  if (result) {
    return gql.replaceAll(' '.repeat(result[0].length), '');
  }
  return gql;
}

class CommonService {
  public host: string;
  public key: string;

  constructor(host: string, key: string) {
    this.host = host;
    if (key === 'graphql') {
      this.post = (gql: string) => {
        const query = prettyGql(gql);
        return CommonService.prototype.post.call(this, { query });
      };
    }
  }

  get(url: string) {
    return request<ResponseData>(this.host + url);
  }

  post(url: string, data: any) {
    // for graphql
    if (typeof url === 'string') {
      return request<ResponseData>(this.host + url, {
        method: 'POST',
        data,
      });
    }
    return request<ResponseData>(this.host, {
      method: 'POST',
      data: url,
    });
  }
}

export const api: ServiceListType = Object.entries<string>(
  window.$$config.nacos.service,
).reduce((prev, [key, value]) => {
  return { ...prev, [key]: new CommonService(value, key) };
}, {});

export const appKey = '{{{ appKey }}}';

interface ResponseData {
  code?: number;
  data?: any;
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
  };
  page_info?: {
    total: number;
  };
}
