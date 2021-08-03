import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { plugin, ApplyPluginsType } from 'umi';
import { AppContext, useAppProps } from './sdk';

const rgb2hex = (rgba: string) =>
  `${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+\.{0,1}\d*)?\)$/)
    ?.slice(1)
    .map((n, i) =>
      parseFloat(n).toString(16).padStart(2, '0').replace('NaN', ''),
    )
    .join('')}` ?? 'ffffff';

const ThemeLayout: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('light');
  const appProps = useAppProps();

  useEffect(() => {
    const bgColor = parseInt(
      rgb2hex(getComputedStyle(document.body).backgroundColor),
      16,
    );
    const themeKey = bgColor < 0x666666 ? 'dark' : 'light';
    const theme = plugin.applyPlugins({
      key: themeKey + 'Theme',
      type: ApplyPluginsType.modify,
      initialValue: {},
      async: false,
    });
    setTheme(themeKey);

    const style = ref.current!.style;
    Object.entries<string>(theme).map(([key, value]) => {
      style.setProperty(key, value);
    });
  }, []);

  return (
    <AppContext.Provider value={{ ...appProps, theme }}>
      <div style={{ height: '100%' }} ref={ref}>
        {props.children}
      </div>
    </AppContext.Provider>
  );
};

export default ThemeLayout;
