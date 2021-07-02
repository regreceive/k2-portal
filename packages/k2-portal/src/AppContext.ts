import { createContext } from 'react';

/**
 * 应用之间传递传递参数，通过此context接收数据
 */
export const AppContext = createContext<any>({});
