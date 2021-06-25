import { IConfigFromPlugins } from '@@/core/pluginConfig';

const portal: IConfigFromPlugins = {
  nacos: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
  service: {
    dataService: '//dfem.k2assets.data:8082/data-service/modeler/api/v2',
    datalabModeler: '//dfem.k2assets.data:8082/datalab/modeler/api/v2',
    gateway: '//127.0.0.1/gateway',
    influxdb: '//dfem.influxdb.k2assets.data:8082',
  },
};

export default portal;
