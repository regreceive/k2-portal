import { usePrevious } from 'ahooks';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useEffect, useRef } from 'react';
import { warn } from './utils';

type Props = {
  src: string;
  inline?: boolean;
  appProps?: {
    [key: string]: any;
  };
};

export const Widget: FC<Props> = (props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previous = usePrevious(props.appProps);

  const renderApp = useCallback(() => {
    try {
      // @ts-ignore
      frame.current?.contentWindow?.micPack?.default(
        { appBody: bodyRef.current! },
        props.appProps,
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

  return (
    <div
      data-name="widget"
      style={{ display: props.inline ? 'inline' : 'block' }}
    >
      <iframe
        ref={frame}
        onLoad={renderApp}
        src={props.src}
        style={{ display: 'none' }}
      />
      <div ref={bodyRef} />
    </div>
  );
};

Widget.defaultProps = {
  inline: false,
};
