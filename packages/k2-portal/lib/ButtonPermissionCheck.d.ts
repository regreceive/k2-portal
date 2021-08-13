import { FC } from 'react';
declare type Props = {
    /** 权限关键字 */
    accessKey: string;
    /** 禁止当前访问key情况下，子组件的属性 */
    forbiddenFieldProps: {
        [key: string]: any;
    };
    /** 子节点更新依赖项 */
    deps?: any;
};
export declare const ButtonPermissionCheck: FC<Props>;
export declare function useButtonPermissionCheck(accessKey: string): boolean;
export {};
