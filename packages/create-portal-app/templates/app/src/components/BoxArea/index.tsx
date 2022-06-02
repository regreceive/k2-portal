import { FC, ReactNode } from 'react';
import Title from './components/Title';
import styles from './style.less';

interface Props {
  title?: ReactNode | string;
  rightArea?: ReactNode;
  height?: number;
  style?: React.CSSProperties;
  /** 如果里面包含pro-table组件，不希望table内容跟随BoxArea高度，则设置true */
  disableHeightFixed?: boolean;
}

const BoxArea: FC<Props> = (props) => {
  return (
    <div
      className={`${styles.boxArea} ${
        props.disableHeightFixed && 'disable-height-fixed'
      }`}
      style={props.style}
    >
      {props.title && <Title text={props.title}>{props.rightArea}</Title>}
      <div
        style={{ height: props.height !== undefined ? props.height : 'unset' }}
        className={styles.content}
      >
        {props.children}
      </div>
    </div>
  );
};

export default BoxArea;
