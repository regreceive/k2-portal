import { FC, useCallback, useState } from 'react';
import { Button, Typography } from 'antd';
import { history } from 'umi';
import BoxArea from '@/components/BoxArea';
import queryMenu from './menu.gql';

/**
 * 建议安装vs-code插件GraphQL获得gql代码高亮
 * https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql
 */

const Home: FC = () => {
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

      <BoxArea title="路由跳转">
        <Button
          onClick={() => {
            history.push('/other-page');
          }}
        >
          /home/page1
        </Button>
      </BoxArea>
    </>
  );
};

export default Home;
