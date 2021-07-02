"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useChart;

function _react() {
  const data = _interopRequireWildcard(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _ahooks() {
  const data = require("ahooks");

  _ahooks = function _ahooks() {
    return data;
  };

  return data;
}

function echarts() {
  const data = _interopRequireWildcard(require("echarts"));

  echarts = function echarts() {
    return data;
  };

  return data;
}

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useChart(height = 300) {
  const chart = (0, _react().useRef)();
  const ref = (0, _react().useRef)(null);
  const update = (0, _ahooks().useUpdate)();
  (0, _react().useEffect)(() => {
    if (ref.current) {
      chart.current = echarts().init(ref.current);
      update();
    }

    return () => {
      if (chart.current && chart.current.dispose) {
        chart.current.dispose();
      }
    };
  }, []);
  /** 图表自适应 */

  const box = (0, _ahooks().useSize)(ref.current);
  (0, _react().useEffect)(() => {
    if (chart.current) {
      chart.current.resize({
        // width: box.width as number,
        height
      });
    }
  }, [box.width, height]); // 强制初始化

  const enforceInit = (0, _react().useCallback)(() => {
    chart.current = echarts().init(ref.current);
  }, []); // 图表选项设置

  const setOption = (0, _react().useCallback)((EChartsOption, notMerge, lazyUpdate) => {
    var _chart$current, _chart$current2;

    (_chart$current = chart.current) === null || _chart$current === void 0 ? void 0 : _chart$current.clear();
    (_chart$current2 = chart.current) === null || _chart$current2 === void 0 ? void 0 : _chart$current2.setOption(EChartsOption, notMerge, lazyUpdate);
  }, []); // 显示空数据界面

  const showEmpty = (0, _react().useCallback)((text = '暂无数据') => {
    setOption({
      title: {
        text,
        left: 'center',
        top: 'center',
        textStyle: {
          color: 'rgba(0,0,0,.3)',
          fontSize: 20
        }
      },
      backgroundColor: 'rgba(127,127,127,.05)'
    });
  }, []);
  return {
    ref,
    setOption,
    enforceInit,
    showEmpty,
    chart: chart.current
  };
}