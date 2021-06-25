// @ts-nocheck
import { request } from 'umi';

const namespace = env.RUNTIME_NAMESPACE as string;

async function observeRequest(req: Promise<any>) {
  try {
    const response = await req;
    return {
      err: null,
      res: response,
    };
  } catch (e) {
    return {
      err: e,
    };
  }
}

// 方便mock和真实接口切换
function adapt(host: string, url: string) {
  if (/^\/mock/.test(url)) {
    return url.replace('{namespace_name}', namespace).replace('/mock', '');
  }
  return host + url.replace('{namespace_name}', namespace);
}

export default class MockService {
  public host: string;
  public withDB: boolean;

  constructor(host: string, withDB = false) {
    this.host = host;
    this.withDB = withDB;
  }

  get = (url: string) => {
    const host = this.host;
    const withDB = this.withDB;

    return {
      end: function () {
        let nextUrl = url;
        if (withDB) {
          nextUrl = url + '&db={namespace_name}';
        }
        return observeRequest(request(adapt(host, nextUrl)));
      },
    };
  };

  post = (url: string, data: any) => {
    const host = this.host;
    return {
      end: () => {
        return observeRequest(
          request(adapt(host, url), {
            method: 'POST',
            data,
          }),
        );
      },
    };
  };
}
