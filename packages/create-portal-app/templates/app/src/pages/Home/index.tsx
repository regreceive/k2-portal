import { FC, useCallback, useState } from 'react';
import { history } from 'umi';
import { Button, Typography } from 'antd';
import { getInstance } from 'k2-portal';
import BoxArea from '@/components/BoxArea';

const Home: FC = () => {
  const [result, setResult] = useState<any>({});

  // 获得菜单
  const handleBtnClick = useCallback(async () => {
    const res = await getInstance('bcf_front_menu', {
      param: {
        start: true,
      },
    });
    setResult(res);
  }, []);

  return (
    <>
      <BoxArea title="快速开始">
        <Typography.Paragraph>
          <pre>
            <div>$ mkdir app && cd $_</div>
            <div>$ yarn create portal-app</div>
          </pre>
        </Typography.Paragraph>
      </BoxArea>

      <BoxArea title="api请求示例" height={200}>
        <Button onClick={handleBtnClick}>获得菜单</Button>
        <pre style={{ marginTop: 20 }}>
          <code>Response: {JSON.stringify(result, null, 4)}</code>
        </pre>
      </BoxArea>

      <BoxArea title="路由跳转">
        <Button
          onClick={() => {
            history.push('/home/page1');
          }}
        >
          /home/page1
        </Button>
      </BoxArea>
    </>
  );
};

export default Home;
