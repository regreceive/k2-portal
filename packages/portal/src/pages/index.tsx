import { Widget } from 'k2-portal';
import { FC } from 'react';

const Portal: FC = (props) => {
  return <Widget src="/apps/point" style={{ height: '100%' }} appRoot />;
};

export default Portal;
