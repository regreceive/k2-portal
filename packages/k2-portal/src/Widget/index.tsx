import usePrevious from 'ahooks/es/usePrevious';
import { Spin } from 'antd';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import { portal } from '../';
import { warn } from '../utils';
import './style.css';

type Props = {
  /** 应用地址，一定要同域 */
  src: string;
  /** 样式名称 */
  className?: string;
  style?: React.CSSProperties;
  /** 向应用传递参数，字段自拟 */
  appProps?: {
    [key: string]: any;
  };
  /** 是否作为app容器 */
  appRoot?: boolean;
};

const Widget: FC<Props> = (props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const link = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previous = usePrevious(props.appProps);
  const [loading, setLoading] = useState(true);

  const iframeUrl = useMemo(() => {
    // 作为主应用，url受控
    if (props.appRoot) {
      const url = portal.config.appPath + portal.currAppUrl;
      if (url) {
        return url;
      }
    }
    const targetUrl = (portal.config.appPath + '/' + props.src).replace(
      /\/{2,}/g,
      '/',
    );

    if (
      props.src === '' ||
      props.src.includes('#') ||
      props.src.endsWith('/')
    ) {
      return targetUrl;
    }
    return targetUrl + '/';
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
      portal.setAppIframe(frame.current);
    }
  }, [props.appRoot]);

  const moveCSS = useCallback(() => {
    const url =
      frame.current?.contentDocument?.querySelector<HTMLLinkElement>(
        'link[href$=".css"]',
      )?.href;
    if (url) {
      const ele = link.current?.ownerDocument.createElement('link');
      if (ele) {
        ele.href = url;
        ele.type = 'text/css';
        ele.rel = 'stylesheet';
        link.current?.appendChild(ele);
      }
    }
  }, []);

  return (
    <div
      data-name="widget"
      style={{ height: '100%', ...props.style }}
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
              moveCSS();
              renderApp();
            }
          } catch (e) {
            warn(
              `Widget.src[${frame.current?.src}]\n子应用跨域了，返回403、404错误都会导致跨域。`,
            );
          }
        }}
        src={iframeUrl}
        style={{ display: 'none' }}
      />
      <Spin spinning={loading}>
        <div style={{ height: '100%' }} ref={bodyRef} />
      </Spin>
    </div>
  );
};

export default Widget;
