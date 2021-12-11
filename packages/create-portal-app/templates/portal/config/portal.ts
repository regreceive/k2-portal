import { IConfigFromPlugins } from '@@/core/pluginConfig';

const portal: IConfigFromPlugins['portal'] = {
  /** appKey应该与应用中心的key保持一致，如果应用中心不存在该应用，随便写个就可以了 */
  appKey: 'portal',
  role: 'portal',
  nacos: {
    // nacos 如果打开注释，会自动请求线上配置，其配置会覆盖default里面的字段
    // url: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
  },
};

export default portal;
