/// <reference types="react" />
import * as echarts from 'echarts';
export default function useChart<T extends HTMLDivElement>(height?: number): {
    ref: import("react").RefObject<T>;
    setOption: (EChartsOption: echarts.EChartsOption, notMerge?: boolean | undefined, lazyUpdate?: boolean | undefined) => void;
    enforceInit: () => void;
    showEmpty: (text?: string) => void;
    chart: echarts.ECharts | undefined;
};
