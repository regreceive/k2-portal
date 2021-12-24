import React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { plugin, ApplyPluginsType } from 'umi';
import { utils } from 'k2-portal';
import { AppContext } from './sdk';

const ThemeLayout: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const appProps = useContext(AppContext);

  useEffect(() => {
    if (!appProps.theme) {
      return;
    }
    const appTheme = plugin.applyPlugins({
      key: appProps.theme.style + 'Theme',
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
  }, [appProps.theme]);

  return (
    <div className="k2-umi-root" ref={ref}>
      {props.children}
    </div>
  );
};

export default ThemeLayout;
