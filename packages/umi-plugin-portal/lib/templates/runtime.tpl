import { notification, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { RequestConfig } from 'umi';
import { AppContext } from './sdk';
import ThemeLayout from './ThemeLayout';

let rootElement: HTMLDivElement;
let appRender: Function;
let appProps = {{{ appDefaultProps }}};

//@ts-ignore
window.micPack = {
  default: async (obj: any, props: any) => {
    rootElement = obj.appBody;
    // 如果在portal通过本地调试，portal会把sdk传过来，所以不接收
    if (props.sdk === undefined) {
      appProps = props;
    }
    appRender();
  },
};

export function modifyClientRenderOpts(memo: any) {
  return {
    ...memo,
    rootElement: rootElement || memo.rootElement,
  };
}

export function render(oldRender: Function) {
  appRender = oldRender;
  if (window.$$config?.alone) {
    oldRender();
  }
}

export function rootContainer(container) {
  // 不管是独立应用还是子应用，都要使用antd中文包
  return (
    <AppContext.Provider value={appProps}>
      <ConfigProvider componentSize="middle" locale={zhCN}>
        <ThemeLayout>
          {container}
        </ThemeLayout>
      </ConfigProvider>
    </AppContext.Provider>
  );
}

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
    return;
  }

  notification.error({
    description: '您的网络发生异常，无法连接服务器',
    message: '网络异常',
  });
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [
    (url, options) => {
      const headers = {
        ...options.headers,
        // k2assets接口需要添加权限字段
        Authorization: '{{{ authorization }}}',
      };
      return {
        url,
        options: {
          ...options,
          headers,
        },
      };
    },
  ],
};

export const lightTheme = {
  '--portal-boxArea-bgColor': '#ffffff',
  '--portal-scroll-fore': '#ffffff',
  '--portal-scroll-fore-0': 'rgba(255, 255, 255, 0)',
  '--portal-scroll-inverse': 'rgba(0, 0, 0, 0)',
  '--portal-scroll-inverse-2': 'rgba(0, 0, 0, 0.2)',
};

export const darkTheme = {
  '--portal-boxArea-bgColor': '#000000',
  '--portal-scroll-fore': '#000000',
  '--portal-scroll-fore-0': 'rgba(0, 0, 0, 0)',
  '--portal-scroll-inverse': 'rgba(255, 255, 255, 0.2)',
  '--portal-scroll-inverse-2': 'rgba(255, 255, 255, 0.5)',
};
