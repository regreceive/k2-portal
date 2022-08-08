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

    const popContainer = document.querySelector<HTMLDivElement>('#pop-{{antdPopContainerId}}');
    const styleString =
      JSON.stringify(appTheme)
        .replace(/[\{\}"]/g, '')
        .replaceAll(',', ';');

    ref.current!.style = styleString;
    popContainer.style = styleString + ';width:unset;height:unset;';
  }, [currTheme]);

  return (
    <div className={'k2-umi-root el-{{antdPopContainerId}}'} ref={ref}>
      {props.children}
    </div>
  );
};

export default ThemeLayout;
