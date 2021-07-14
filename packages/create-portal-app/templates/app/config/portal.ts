import { IConfigFromPlugins } from '@@/core/pluginConfig';

const portal: IConfigFromPlugins['portal'] = {
  nacos: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
  service: {
    influxdb: '/repo/repo-data/dfem_point_test_influxdb',
    repo: '/repo/repos/dfem_point_test_influxdb',
  },
};

export default portal;
