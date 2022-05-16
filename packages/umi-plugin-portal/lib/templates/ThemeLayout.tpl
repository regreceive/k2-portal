import React from 'react';
import { useEffect, useRef } from 'react';
import { plugin, ApplyPluginsType } from 'umi';
import { utils } from 'k2-portal';
import { useMessage } from './sdk';

const ThemeLayout: React.FC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const currTheme = useMessage('portal.theme');

  useEffect(() => {
     const appTheme = plugin.applyPlugins({
      key: (currTheme?.style ?? 'light') + 'Theme',
      type: ApplyPluginsType.modify,
      initialValue: {},
      async: false,
    });

    const style = ref.current!.style;
    const popContainer = utils.isInWidget()
      ? window.parent?.document.querySelector<HTMLDivElement>('#{{antdPopContainerId}}')
      : document.querySelector<HTMLDivElement>('#{{antdPopContainerId}}');

    Object.entries<string>(appTheme).map(([key, value]) => {
      if (key.startsWith('--portal') && utils.isInWidget()) {
        return;
      }
      style.setProperty(key, value);
      popContainer.style.setProperty(key, value);
    });
  }, [currTheme]);

  return (
    <div className="k2-umi-root" ref={ref}>
      {props.children}
    </div>
  );
};

export default ThemeLayout;
