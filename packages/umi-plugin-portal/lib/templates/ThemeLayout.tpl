import React from 'react';
import { useEffect, useRef } from 'react';
import { plugin, ApplyPluginsType } from 'umi';
import { utils } from 'k2-portal';
import { useMessage } from './sdk';

const ThemeLayout: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const appProps = useMessage();

  useEffect(() => {
    if (!appProps['portal.theme']) {
      return;
    }
    const appTheme = plugin.applyPlugins({
      key: appProps['portal.theme'].style + 'Theme',
      type: ApplyPluginsType.modify,
      initialValue: {},
      async: false,
    });

    const style = ref.current!.style;
    Object.entries<string>(appTheme).map(([key, value]) => {
      if (key.startsWith('--portal') && utils.isInWidget) {
        return;
      }
      style.setProperty(key, value);
    });
  }, [appProps['portal.theme']]);

  return (
    <div className="k2-umi-root" ref={ref}>
      {props.children}
    </div>
  );
};

export default ThemeLayout;
