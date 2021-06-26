import { FC, ReactNode } from 'react';
import Title from './components/Title';
import styles from './style.less';

interface Props {
  title: ReactNode | string;
  rightArea?: ReactNode;
  height?: number;
}

const BoxArea: FC<Props> = (props) => {
  return (
    <div className={styles.boxArea}>
      <Title text={props.title}>{props.rightArea}</Title>
      <div
        style={{ height: props.height ? props.height : 'unset' }}
        className={styles.content}
      >
        {props.children}
      </div>
    </div>
  );
};

export default BoxArea;
