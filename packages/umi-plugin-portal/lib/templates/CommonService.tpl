import { request } from 'umi';

export interface ResponseData {
  code?: number;
  data?: {
    rows: any[];
    schema: {
      name: string;
      data_type: string;
    }[];
  };
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

export type CommonServiceType = {
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


export default class CommonService {
  public host: string;

  constructor(host: string) {
    this.host = host;
  }

  get(url: string) {
    return request<ResponseData>(this.host + nextUrl);
  }

  del = (url: string) => {
    return request<ResponseData>(this.host + url, {
      method: 'DELETE',
    });
  };

  post = (url: string, data: any) => {
    // for graphql
    if (typeof url === 'string') {
      return request<ResponseData>(this.host + url, {
        method: 'POST',
        data,
      });
    }
    return request<ResponseData>(this.host, {
      method: 'POST',
      url,
    });
  };

  put = (url: string, data: any) => {
    return request<ResponseData>(this.host + url, {
      method: 'PUT',
      data,
    });
  };
}
