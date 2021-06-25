import { FC, useCallback, useState } from 'react';
import { history } from 'umi';
import { Button, Typography } from 'antd';
import { GitlabOutlined } from '@ant-design/icons';
import { getInstance } from '@/services';
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
      <BoxArea
        title="适配3.0"
        rightArea={
          <a href="https://gitlab.kstonedata.k2/bcf/front-end/umi-app-template3.0.git">
            <Button type="primary" icon={<GitlabOutlined />}>
              前往项目
            </Button>
          </a>
        }
      >
        我们使用开放的、社区活跃的Umi，集成到公司的Portal前端容器，减少非必要开发流程，尽可能多利用Portal沉淀的技术资产，基于代码做到应用的快速开发。
      </BoxArea>

      <BoxArea title="快速开始">
        <Typography.Paragraph>
          <pre>
            <div>$ yarn create portal-app your_project_folder_name</div>
            <div>$ cd your_project_folder_name && yarn install</div>
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
