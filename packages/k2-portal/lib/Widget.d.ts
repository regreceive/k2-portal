import { FC } from 'react';
declare type Props = {
    /** 应用地址，一定要同域 */
    src: string;
    /** 应用是否是行内 */
    inline?: boolean;
    /** 应用导入占位符 */
    loading?: React.ReactNode;
    /** 样式名称 */
    className?: string;
    /** 向应用传递参数，字段自拟 */
    appProps?: {
        [key: string]: any;
    };
};
export declare const Widget: FC<Props>;
export {};
