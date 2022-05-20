import useSize from 'ahooks/es/useSize';
import useUpdate from 'ahooks/es/useUpdate';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef } from 'react';

type Options = {
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
export default function useChart<T extends HTMLDivElement>(
  theme?: string,
  opts?: Options,
) {
  const chart = useRef<echarts.ECharts>();
  const ref = useRef<T>(null);
  const emptyView = useRef(false);
  const update = useUpdate();

  useEffect(() => {
    if (ref.current) {
      chart.current = echarts.init(ref.current as HTMLDivElement, theme, opts);
      update();
    }

    return () => {
      if (chart.current && chart.current.dispose) {
        chart.current.dispose();
      }
    };
  }, [theme]);

  /** 图表自适应 */
  const box = useSize(ref.current);
  useEffect(() => {
    if (chart.current) {
      chart.current.resize();
    }
  }, [box?.width, box?.height]);

  // 图表选项设置
  const setOption = useCallback(
    (
      EChartsOption: echarts.EChartsOption,
      notMerge?: boolean,
      lazyUpdate?: boolean,
      forceInit = false,
    ) => {
      if (emptyView.current) {
        chart.current?.clear();
        emptyView.current = false;
      }
      if (forceInit) {
        chart.current = echarts.init(
          ref.current as HTMLDivElement,
          theme,
          opts,
        );
      }
      chart.current?.setOption(EChartsOption, notMerge, lazyUpdate);
    },
    [],
  );

  // 显示空数据界面
  const showEmpty = useCallback((text: string = '暂无数据') => {
    chart.current?.clear();
    setOption({
      title: {
        text,
        left: 'center',
        top: 'center',
        textStyle: {
          color: 'rgba(0,0,0,.3)',
          fontSize: 20,
        },
      },
      backgroundColor: 'rgba(127,127,127,.05)',
    });
    emptyView.current = true;
  }, []);

  return {
    ref,
    setOption,
    showEmpty,
    chart: chart.current,
  };
}
