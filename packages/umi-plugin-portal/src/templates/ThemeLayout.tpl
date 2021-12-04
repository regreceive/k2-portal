import React from 'react';
import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { plugin, ApplyPluginsType } from 'umi';

export const AppContext = createContext<any>({});
/**
 * 返回父级应用传入的属性
 */
export function useAppProps<T>() {
  return useContext<T>(AppContext);
}

const ThemeLayout: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('light');
  const appProps = useAppProps();

  useEffect(() => {
    const themeKey = 'light';
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
    <AppContext.Provider value={{ theme, ...appProps }}>
      <div className="k2-umi-root" ref={ref}>
        {props.children}
      </div>
    </AppContext.Provider>
  );
};

export default ThemeLayout;
