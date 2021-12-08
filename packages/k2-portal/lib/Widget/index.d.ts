import { FC } from 'react';
declare type Props = {
    /** 应用地址，一定要同域 */
    src: string;
    /** 样式名称 */
    className?: string;
    style?: React.CSSProperties;
    /** 向应用传递参数，字段自拟 */
    appProps?: {
        [key: string]: any;
    };
    /** 是否作为app容器 */
    appRoot?: boolean;
};
declare const Widget: FC<Props>;
export default Widget;
