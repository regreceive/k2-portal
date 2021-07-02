import { useContext } from 'react';
import { Typography } from 'antd';
import { AppContext } from 'k2-portal';

const Child = () => {
  const appProps = useContext(AppContext);
  return (
    <div>
      <Typography.Title level={2}>子应用，接收到的应用传参</Typography.Title>
      <Typography.Text code>
        <pre>
          {JSON.stringify(appProps, null, 2)}
        </pre>
      </Typography.Text>
    </div>
  )
}

export default Child;