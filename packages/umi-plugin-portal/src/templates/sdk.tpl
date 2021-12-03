import { createContext, useContext } from 'react';
import CommonService from './CommonService';
import type { CommonServiceType } from './CommonService';

type ServiceListType = {
  {{#service}}
  {{.}}: CommonServiceType;
  {{/service}}
};

// @ts-ignore
const service: ServiceListType = Object.entries<string>(window.$$config.service)
  .reduce((prev, [key, value]) => {
    return {...prev, [key]: new CommonService(value)};
  }, {});

export const appKey = '{{{ appKey }}}';
export const api = service;
export const AppContext = createContext<any>({{{ appDefaultProps }}});
export function useAppProps<T>() {
  return useContext<T>(AppContext);
}