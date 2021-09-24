import { request } from 'umi';

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
  };
  page_info?: {
    total: number;
  };
}

const namespace = env.RUNTIME_NAMESPACE as string;

// 方便mock和真实接口切换
function adapt(host: string, url: string) {
  if (/^\/mock/.test(url)) {
    return url.replace('{namespace_name}', namespace).replace('/mock', '');
  }
  return host + url.replace('{namespace_name}', namespace);
}

export default class MockService {
  public host: string;

  constructor(host: string) {
    this.host = host;
  }

  get<T = any>(url: string) {
    return request<ResponseData<T>>(adapt(this.host, url));
  }

  del = (url: string) => {
    return request<ResponseData<any>>(adapt(this.host, url), {
      method: 'DELETE',
    });
  };

  post = (url: string, data: any) => {
    return request<ResponseData<any>>(adapt(this.host, url), {
      method: 'POST',
      data,
    });
  };

  put = (url: string, data: any) => {
    const host = this.host;
    return request<ResponseData<any>>(adapt(this.host, url), {
      method: 'PUT',
      data,
    });
  };
}
