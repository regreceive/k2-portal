import { FC } from 'react';
declare type Props = {
    /** 应用地址，一定要同域 */
    src: string;
    /** 向应用传递的参数 */
    appProps?: {
        [key: string]: any;
    };
    /** 是否作为主应用容器，其路由地址将同步到Portal应用的地址栏 */
    appRoot?: boolean;
    /** 样式名称 */
    className?: string;
    style?: React.CSSProperties;
};
declare const Widget: FC<Props>;
export default Widget;
