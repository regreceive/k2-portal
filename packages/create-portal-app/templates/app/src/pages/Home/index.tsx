import { FC, useCallback, useState } from 'react';
import { Button, Typography } from 'antd';
import { history } from 'umi';
import { api } from 'k2-portal';
import BoxArea from '@/components/BoxArea';
import queryMenu from './menu.gql';

/**
 * 建议安装vs-code插件GraphQL获得gql代码高亮
 * https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql
 */

const Home: FC = () => {
  const [result, setResult] = useState<any>({});

  // 获得菜单
  const handleBtnClick = useCallback(async () => {
    const res = await api.graphql.post(queryMenu);
    setResult(res);
  }, []);

  return (
    <>
      <BoxArea title="快速开始" rightArea={<a href="http://192.168.130.100:8341/">文档</a>}>
        <Typography.Paragraph>
          <pre>
            <div>$ mkdir app &amp;&amp; cd $_</div>
            <div>$ npx create-portal-app@latest</div>
          </pre>
        </Typography.Paragraph>
      </BoxArea>

      <BoxArea title="api请求示例">
        <Button onClick={handleBtnClick}>获得菜单</Button>
        <Typography.Paragraph>
          <pre style={{ maxHeight: 200, overflow: 'hidden auto' }}>
            Response: {JSON.stringify(result, null, 4)}
          </pre>
        </Typography.Paragraph>
      </BoxArea>

      <BoxArea title="路由跳转">
        <Button
          onClick={() => {
            history.push('/home/other-page');
          }}
        >
          /home/page1
        </Button>
      </BoxArea>
    </>
  );
};

export default Home;
