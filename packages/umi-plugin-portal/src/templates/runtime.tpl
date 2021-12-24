import { notification, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import { utils } from 'k2-portal';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { AppContext } from './sdk';
import { portal } from './portal';
import ThemeLayout from './ThemeLayout';

let rootElement: HTMLDivElement;
let appRender: Function;
let appProps = {{{ appDefaultProps }}};

//@ts-ignore
window.renderChildApp =  (element: HTMLDivElement, props: any) => {
  appProps = {...appProps, ...props};
  rootElement = element;
  appRender();
};

window.addEventListener('unload', () => {
  if (rootElement) {
    ReactDOM.unmountComponentAtNode(rootElement);
  }
});

const interest = new Set({{{ interestMessage }}});

if (utils.isInPortal || utils.isPortal) {
  window.$$config.id = portal._registerMessageSubscriber(
    (props: any, tag: string) => {
      if (interest.has(tag) && isPlainObject(props)) {
        const digest = Object.keys(props).some(
          (key) => !isEqual(appProps[key], props[key]),
        );
        if (digest) {
          if (utils.isInWidget) {
            if (rootElement) {
              renderChildApp(rootElement, props);
            } else {
              // 父层还没来得及调用renderChildApp
              appProps = { ...appProps, ...props };
            }
          } else {
            // entry和portal合体
            appProps = { ...appProps, ...props };
            appRender();
          }
        }
      }
    },
  );
  window.addEventListener('unload', () => {
    portal._unregisterMessageSubscriber(window.$$config.id);
  });
}

export function modifyClientRenderOpts(memo: any) {
  return {
    ...memo,
    rootElement: rootElement || memo.rootElement,
  };
}

export function render(renderNow: Function) {
  appRender = renderNow;
  if (!utils.isInWidget) {
    renderNow();
  }
}

const errorLink = onError((error) => {
  console.log(error);
});

const requestLink = new HttpLink({
  uri: portal.config.nacos.service.graphql,
  headers: {
    Authorization: portal.accessToken || '{{{ customToken }}}' || '{{{ basic }}}',
  },
});

const client = new ApolloClient({
  link: from([errorLink, requestLink]),
  cache: new InMemoryCache(),
});

export function rootContainer(container) {
  // 不管是独立应用还是子应用，都要使用antd中文包
  return (
    <AppContext.Provider value={appProps}>
      <ApolloProvider client={client}>
        <ConfigProvider
          componentSize="middle"
          locale={zhCN}
          getPopupContainer={() => {
            if (utils.isInPortal) {
              return window.parent?.document.querySelector('#{{{ appKey }}}');
            }
            return document.body;
          }}
        >
          <ThemeLayout>{container}</ThemeLayout>
        </ConfigProvider>
      </ApolloProvider>
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

export const request = {
  errorHandler,
  requestInterceptors: [
    (url, options) => {
      const headers = {
        ...options.headers,
        // k2assets接口需要添加权限字段
        Authorization: portal.accessToken || '{{{ customToken }}}' || '{{{ basic }}}',
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
  '--portal-scrollbar-fore': 'rgb(190, 190, 190)',
  '--portal-scrollbar-back': 'rgba(219, 219, 219, .5)',
  '--portal-boxArea-bgColor': '#ffffff',
};

export const darkTheme = {
  '--portal-scrollbar-fore': 'rgb(90, 90, 90)',
  '--portal-scrollbar-back': 'rgba(90, 90, 90, .3)',
  '--portal-boxArea-bgColor': '#000000',
};
