/**
 * 应用内打开其它app
 * @param opt
 */
export default function openApp(opt: {
    /** appKey */
    appKey: string;
    /** 应用内部路由 */
    path: string;
    /** 路由是否replace模式 */
    isReplace?: boolean;
}): void;
