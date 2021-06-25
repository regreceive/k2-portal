import { useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useSize, useUpdate } from 'ahooks';

export default function useChart<T extends HTMLDivElement>(
  height: number = 300,
) {
  const chart = useRef<echarts.ECharts>();
  const ref = useRef<T>(null);
  const update = useUpdate();

  useEffect(() => {
    if (ref.current) {
      chart.current = echarts.init(ref.current as HTMLDivElement);
      update();
    }

    return () => {
      if (chart.current && chart.current.dispose) {
        chart.current.dispose();
      }
    };
  }, []);

  /** 图表自适应 */
  const box = useSize(ref.current);
  useEffect(() => {
    if (chart.current) {
      chart.current.resize({
        // width: box.width as number,
        height,
      });
    }
  }, [box.width, height]);

  // 强制初始化
  const enforceInit = useCallback(() => {
    chart.current = echarts.init(ref.current as HTMLDivElement);
  }, []);

  // 图表选项设置
  const setOption = useCallback(
    (
      EChartsOption: echarts.EChartsOption,
      notMerge?: boolean,
      lazyUpdate?: boolean,
    ) => {
      chart.current?.clear();
      chart.current?.setOption(EChartsOption, notMerge, lazyUpdate);
    },
    [],
  );

  // 显示空数据界面
  const showEmpty = useCallback((text: string = '暂无数据') => {
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
  }, []);

  return {
    ref,
    setOption,
    enforceInit,
    showEmpty,
    chart: chart.current,
  };
}
