import { FC } from 'react';
import styles from './HolyGrailLayout.less';

const HolyGrailLayout: FC = (props) => {
  return (
    <div className={styles.grid}>
      <div className={styles.main}>{props.children}</div>
      <div className={styles.header}>
        <h1>圣杯布局演示</h1>
      </div>
      <div className={styles.sidebar} />
      <div className={styles.footer} />
    </div>
  );
};

export default HolyGrailLayout;
