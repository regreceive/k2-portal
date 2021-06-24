import React from 'react';
import { ApplyPluginsType } from 'umi';
import { plugin } from '../core/umiExports';

export function rootContainer(container) {
  if (window.$$config.alone) {
    const { ConfigProvider, locales } = window.antd;
    return React.createElement(ConfigProvider, {locale: locales.zh_CN}, container);
  }
  return container;
}