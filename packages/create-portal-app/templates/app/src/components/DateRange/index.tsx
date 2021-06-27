import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import { EventValue, RangeValue } from 'rc-picker/lib/interface';
import moment, { Moment } from 'moment';
import { usePrevious } from 'ahooks';

interface Props {
  /**
   * 时间范围限制天数，默认不限制
   */
  limitDays?: number;
  /**
   * 显示最近几天
   */
  lastDays?: number;
  /** 是否展示时间，默认展示 */
  withTime?: boolean;

  onChange: (range: [EventValue<Moment>, EventValue<Moment>]) => void;
}

const DateRange: FC<Props> = (props) => {
  const [range, setRange] = useState<RangeValue<Moment>>([null, null]);
  const previous = usePrevious(range);
  const rangeRef = useRef<any>(null);

  // 默认时间范围
  useEffect(() => {
    if (props.lastDays) {
      setLastDays(props.lastDays);
    } else {
      setPrevDayDuty();
    }
  }, []);

  //  默认起止时间
  const defaultTimeRange = useMemo(() => {
    return [moment().startOf('day').add(8, 'hour'), moment().startOf('hour')];
  }, []);

  useEffect(() => {
    if (range) {
      if (range[0] && range[1]) {
        if (range[0].isSame(previous?.[0]) && range[1].isSame(previous?.[1])) {
          return;
        }
        if (
          props.limitDays &&
          range[1]?.diff(range[0], 'days') > props.limitDays
        ) {
          message.error(`时间范围不能超过${props.limitDays}天`);
          return;
        }
        props.onChange(range);
      }
    }
  }, [range, props.limitDays]);

  // 设为最近几天
  const setLastDays = useCallback((days: number) => {
    const today = moment().startOf('day');
    const range: RangeValue<Moment> = [
      today.clone().subtract(days - 1, 'day'),
      today.endOf('day'),
    ];
    rangeRef.current?.blur();
    setRange(range);
  }, []);

  // 设置为上一个班次的时间范围
  const setPrevDayDuty = useCallback(() => {
    const range: RangeValue<Moment> = [
      moment().startOf('day').subtract(1, 'd').add(8, 'hour'),
      moment().startOf('day').add(Math.min(8, moment().hour()), 'hour'),
    ];
    setRange(range);
  }, []);

  // 响应时间范围组件
  const handleChange = useCallback(
    (range: RangeValue<Moment>) => {
      if (range && range[0] && range[1]) {
        if (!props.withTime) {
          range[0].startOf('day');
          range[1].endOf('day');
        }
        setRange([...range]);
      } else {
        setRange([null, null]);
      }
    },
    [range, props.withTime],
  );

  // 昨天白班的时间范围
  const getShortcut = useCallback((): { [range: string]: [Moment, Moment] } => {
    return {
      昨天白班: [
        moment().startOf('day').subtract(1, 'd').add(8, 'hour'),
        moment().startOf('day').subtract(1, 'd').add(20, 'hour'),
      ],
      昨天夜班: [
        moment().startOf('day').subtract(1, 'd').add(20, 'hour'),
        moment().startOf('day').add(8, 'hour'),
      ],
    };
  }, []);

  return (
    <DatePicker.RangePicker
      ref={rangeRef}
      value={range}
      onChange={handleChange}
      showTime={{
        format: 'HH:mm:ss',
        defaultValue: defaultTimeRange,
      }}
      ranges={getShortcut()}
    />
  );
};

DateRange.defaultProps = {
  withTime: true,
};

export default DateRange;
