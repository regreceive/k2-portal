import usePrevious from 'ahooks/es/usePrevious';
import { Spin } from 'antd';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import { portal } from '../';
import { warn } from '../utils';

type Props = {
  /** 应用地址，一定要同域 */
  src: string;
  /** 向应用传递的参数 */
  appProps?: {
    [key: string]: any;
  };
  /** 是否作为主应用容器，其路由地址将同步到Portal应用的地址栏 */
  appRoot?: boolean;
  /** 样式名称 */
  className?: string;
  style?: React.CSSProperties;
};

const appKeySet = new Set();

// 防iframe页面缓存
function preventDiskCache(url: string) {
  if (url === '') {
    return url;
  }
  const data = new URL(location.origin + url);
  if (appKeySet.has(data.pathname)) {
    return url;
  }
  appKeySet.add(data.pathname);
  data.searchParams.set('pdc', Math.random().toString().slice(2));
  return data.toString();
}

const Widget: FC<Props> = (props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const link = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previous = usePrevious(props.appProps);
  const [loading, setLoading] = useState(true);

  const iframeUrl = useMemo(() => {
    // 作为主应用，url受控
    if (props.appRoot) {
      const url = portal.config.nacos.appRootPathName + portal.currAppUrl;
      if (portal.currAppUrl === '') {
        return '';
      }
      return preventDiskCache(url);
    }
    const targetUrl = (
      portal.config.nacos.appRootPathName +
      '/' +
      props.src
    ).replace(/\/{2,}/g, '/');

    if (
      props.src === '' ||
      props.src.includes('#') ||
      props.src.endsWith('/')
    ) {
      return preventDiskCache(targetUrl);
    }
    return preventDiskCache(targetUrl + '/');
  }, [props.src, props.appRoot]);

  const renderApp = useCallback(() => {
    // 有可能来自appProps的更新，此时iframe还没有加载完页面造成没有renderChildApp这个函数
    // @ts-ignore
    frame.current?.contentWindow?.renderChildApp?.(
      bodyRef.current!,
      props.appProps,
    );
  }, [props.appProps, iframeUrl]);

  // 应用的props更新，进行一次渲染
  useEffect(() => {
    const appWindow = frame.current?.contentWindow;
    if (!appWindow) return;

    if (props.appProps && !isEqual(props.appProps, previous)) {
      renderApp();
    }
  }, [props.appProps]);

  useEffect(() => {
    if (props.appRoot) {
      portal.setRootAppChangeUrl((url: string) => {
        try {
          const location = frame.current!.contentWindow!.location;
          if (!url.startsWith(location.pathname)) {
            // 应用间切换
            setLoading(true);
            location.replace(preventDiskCache(url));
            return;
          }
          // 应用内部的路由切换
          frame.current?.contentWindow?.history.replaceState(null, '', url);
        } catch (e) {
          warn('主应用跨域');
          frame.current!.src = url;
        }
      });
    }
  }, [props.appRoot]);

  return (
    <div
      data-name="widget"
      style={{ ...props.style }}
      className={classNames('k2-umi-widget', props.className)}
    >
      <div data-name="style" ref={link} />
      <iframe
        ref={frame}
        onLoad={() => {
          try {
            // about: blank也会触发onload，这里判断一下
            if (frame.current?.contentWindow?.location.host !== '') {
              setLoading(false);
              // spin更新不及时，会导致容器还处在未渲染状态
              setTimeout(() => {
                renderApp();
              }, 1);
            }
          } catch (e) {
            warn(
              `Widget.src[${frame.current?.src}]\n子应用跨域了，返回403、404错误都会导致跨域。`,
            );
          }
        }}
        {...(iframeUrl ? { src: iframeUrl } : {})}
        style={{ display: 'none' }}
      />
      <Spin spinning={loading}>
        <div style={{ height: '100%' }} ref={bodyRef} />
      </Spin>
    </div>
  );
};

export default Widget;
