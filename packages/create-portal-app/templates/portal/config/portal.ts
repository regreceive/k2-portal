import { IConfigFromPlugins } from '@@/core/pluginConfig';

const portal: IConfigFromPlugins['portal'] = {
  role: 'portal',
  nacos: {
    // nacos 如果打开注释，会自动请求线上配置，其配置会覆盖default里面的字段
    // url: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
    default: {
      appRootPathName: '/apps',
    }
  },
};

export default portal;
