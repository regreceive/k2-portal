---
title: API
order: 1
toc: menu
nav:
  title: API
  order: 3
---

# API

应用开发相关的 api，组件引入均来自`k2-portal`

## 通用接口服务

### api

api 移植自老应用模板，写法以及请求参数与旧版本基本一致。

不同之处：

1. 发请求后不需要`.end()`来结尾。
2. 不支持旧版本自研的链式调用，比如`.reqFs` `.file`等晦涩难懂的语法。

服务类型目前默认支持的有

- dataService 建模器
- gateway 项目接口
- influxdb 时序数据查询
- repo 时序数据服务

本地启用服务方式

1. 在`config/portal.ts`配置`service`，输入所需服务的地址。
2. 如果希望使用线上项目 nacos 的配置，则无需第一步，直接配置`nacos`的地址即可。
3. 本地开发环境访问线上接口会遇到跨域问题，请到`config/proxy.ts`中做进一步代理配置。

示例：

```ts
import { api } from 'k2-portal';

// 增
api.dataService.post('/xxx', payload);
// 删
api.dataService.delete(`/xxx?entity_ids=${id}`);
// 改
api.dataService.put(`/xxx`, { entities: payload });
// 查
api.dataService.get('/xxx').then((res) => {
  const data = res.data || [];
});
```

### getInstance

建模器单实体查询，封装`dataService.get`，区别在于请求参数实现了对象化

```ts
getInstance('entity', {
  entity_ids: 1,
  attributes: 'column1|column2',
});
// xxx/entities?entity_ids=1,2&attributes=column1|column2

// 列条件封装
getInstance('entity', {
  param: {
    name: [1, 2],
  },
});
// xxx/entities?name=1 or name=2

getInstance('entity', {
  param: {
    name: ['$and', 1, 2],
  },
});
// xxx/entities?name=1 and name=2

getInstance('entity', {
  param: {
    name: ['$range', 1, 2],
  },
});
// xxx/entities?name>=1 and name<=2
```

返回数据类型

```ts
type ResponseInstance = {
  attributes: any;
  entity_id: number;
};
```

### getRelation

建模器关联实体查询，封装`dataService.get`，区别在于请求参数实现了对象化，具体使用与`getInstance`调用方法相同

```ts
getRelation('entity');
```

返回数据类型

```ts
interface ResponseRelation {
  attributes: { [key: string]: any };
  entity_id: number;
  relationship_id: number;
  relation_type: string;
  data: ResponseRelation[];
}
```

## utils

工具函数

### utils.isInPortal

判断当前应用是否在 Portal 中。有些情况，要考虑独立应用和被集成 Portal 场景，如果开发 k2portal 功能，使用会比较频繁。

## 其它

### sdk <Badge>deprecated</Badge>

k2-portal 封装了旧版本的方法，如果不能满足需求。sdk 返回 Portal 的$$\_K2_SDK。

示例：

```ts
import { sdk } from 'k2-portal';
```

### portalWindow

在应用内获得 Portal 的`window`对象。应用内的 window 是自身的`window`对象，但`window.document`则是 Portal 的`document`，这样处理是为了避免事件监听出错。

<Alert type="info">如果应用独立运行，此时的`portalWindow`是其自身。</Alert>

示例：

```ts
import { portalWindow } from 'k2-portal';

// 创建二进制URL对象，必须引用Portal的URL，否则不起作用
const url = portalWindow.URL.createObjectURL(new Blob([]));
```

### appKey

运行时获取，返回应用的 appKey，此设置在 `config/portal.ts` 中定义。

### openApp<Badge>portal</Badge>

跨应用跳转，操作 Portal 跳转路由到指定应用

| 属性      | 说明                  | 类型      | 默认值  |
| --------- | --------------------- | --------- | ------- |
| appKey    | 应用 key              | `string`  | `null`  |
| path      | 应用内部路由          | `string`  | `null`  |
| isReplace | 路由是否 replace 模式 | `boolean` | `false` |

示例：

```ts
import { openApp } from 'k2-portal';

openApp({ appKey: 'case', path: `/home/${record.id}` });
```

### getAppConfig

获得应用配置，与`useAppConfig`作用相同，区别是此方法为函数。

```ts
import { getAppConfig } from 'k2-portal';

getAppConfig<{ a: 1 }>('case').then((config) => {
  const a = config.a;
});
```

### ButtonPermissionCheck

按钮级权限组件，如果当前权限不允许操作，则会使 forbiddenFieldProps 的设置应用到子组件内部。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| accessKey | 权限名称 | `string` | `null` |
| forbiddenFieldProps | 子组件属性，如果禁止生效，则将其属性赋值到子组件内部 | `any` | `null` |
| deps | 依赖项，如果依赖项不更新，子组件是不会刷新的 | `any[]` | `[]` |

```ts
import { ButtonPermissionCheck } from 'k2-portal';

export default () => {
  return (
    <ButtonPermissionCheck
      accessKey="case.edit"
      forbiddenFieldProps={{ disabled: true }}
    >
      <Button>编辑</Button>
    </ButtonPermissionCheck>
  );
};
```

## hooks

### useAppProps

作为服务化应用，获得当前应用的传参，也可以接收`appDefaultProps`默认传参，用于特定调试场景。

<Alert type="info">系统会自动传`theme`，来通知应用当前 `Portal` 的主题</Alert>

示例：

```ts
import { useAppProps } from 'k2-portal';

export default () => {
  const appProps = useAppProps<{
    param1: Boolean;
    param2: { [key: string]: string };
  }>();

  useEffect(() => {
    // bla...
  }, [appProps.param1]);
};
```

### useAppConfig

如果当前应用在建模器有设置，则可以获得应用设置

| 属性          | 说明         | 类型                 | 默认值 |
| ------------- | ------------ | -------------------- | ------ |
| appKey        | 应用 key     | `string`             | `null` |
| defaultConfig | 默认配置     | `any`                | `null` |
| fn            | 返回结果处理 | `(config: any) => T` | `null` |

```ts
import { useAppConfig } from 'k2-portal';

export default () => {
  const a = useAppConfig<{ a: number }>('case', { a: 1 }, (config) => {
    return config.a;
  });
};
```

### useConfigColumns

获得表格定制列。在 useAppConfig 的基础上进一步封装。

```ts
import { useConfigColumns } from 'k2-portal';

export default () => {
  const tableColumns = useConfigColumns<ProColumns>((config) => {
    const configColumns: any[] = config?.columns ?? [];
    const optionColumn: ProColumns[] = [
      {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
      },
    ];

    return [...configColumns, ...optionColumn];
  });
};
```

### useButtonPermissionCheck

按钮级别的权限控制，设置`config/portal.ts`的`buttonPermissionCheck`会做全局开关控制。如果开启`nacos`，开关会被线上的设置覆盖。

<Alert type="info">与`ButtonPermissionCheck`组件作用相同，只是应用场景不同。如果在一个表格里，重复渲染 ButtonPermissionCheck 有性能损耗，使用 hooks 的话只会调用一遍</Alert>

```ts
import { useButtonPermissionCheck } from 'k2-portal';

export default () => {
  const canEdit = useButtonPermissionCheck('case.edit');
  return <Button disabled={!canEdit}>编辑</Button>;
};
```

### useChart

图表相关。功能和场景较多，建议直接看源码，或看已开发应用作为参考。

```ts
import { useChart } from 'k2-portal';

export default () => {
  const { ref, chart, setOption } = useChart();

  useEffect(() => {
    setOption({
      xAxis: { type: 'time' },
      yAxis: { type: 'value' },
      series: {
        type: 'line',
        data: [[new Date().getTime(), 1]],
      },
    });
  }, []);

  return <div style={{ height: '100%' }} ref={ref} />;
};
```
