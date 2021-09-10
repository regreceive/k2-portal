import { Widget } from 'k2-portal';
import { FC, useEffect } from 'react';
import { history, useLocation } from 'umi';
import sso from './sso';

const Portal: FC = (props) => {
  const location = useLocation();

  // 登录成功跳转
  useEffect(() => {
    if (location.search.startsWith('?code=')) {
      sso.signInCallback(history.replace);
    }
  }, [location.search]);

  return <Widget src="/apps/point" style={{ height: '100%' }} appRoot />;
};

export default Portal;
