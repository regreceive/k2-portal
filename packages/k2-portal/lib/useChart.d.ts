import * as echarts from 'echarts';
declare type Options = {
    renderer?: 'canvas' | 'svg';
    devicePixelRatio?: number;
    width?: number;
    height?: number;
    locale?: string;
};
/**
 *
 * @param theme 预设了light和dark，默认是light
 * @param opts echarts的初始化入参，请传高度值或者在外容器设置高度
 * [reference](https://echarts.apache.org/zh/api.html#echarts.init)
 * @returns
 */
export default function useChart<T extends HTMLDivElement>(theme?: string, opts?: Options): {
    ref: import("react").RefObject<T>;
    setOption: (EChartsOption: echarts.EChartsOption, notMerge?: boolean | undefined, lazyUpdate?: boolean | undefined, forceInit?: any) => void;
    showEmpty: (text?: string) => void;
    chart: echarts.ECharts | undefined;
};
export {};
