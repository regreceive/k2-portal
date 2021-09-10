import usePrevious from 'ahooks/es/usePrevious';
import { Spin } from 'antd';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import { getPortal } from '../';
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

  const renderApp = useCallback(() => {
    try {
      // @ts-ignore
      frame.current?.contentWindow?.micPack?.default(
        { appBody: bodyRef.current! },
        { ...props.appProps, asWidget: true },
      );
    } catch {
      warn(`${props.src}子应用跨域了`);
    }
  }, [props.appProps]);

  useEffect(() => {
    const appWindow = frame.current?.contentWindow;
    if (!appWindow) return;

    if (props.appProps && !isEqual(props.appProps, previous)) {
      renderApp();
    }
  }, [props.appProps]);

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

  const iframeUrl = useMemo(() => {
    // 作为根应用，url受控
    if (props.appRoot) {
      const url = getPortal().currAppUrl;
      if (url) {
        return url;
      }
    }
    if (props.src.includes('#') || props.src.endsWith('/')) {
      return props.src;
    }
    return props.src + '/';
  }, [props.src, props.appRoot]);

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
          if (props.appRoot) {
            getPortal().setAppIframe(frame.current);
          }
          setLoading(false);
          moveCSS();
          renderApp();
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
