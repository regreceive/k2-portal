---
title: 方法
order: 1
toc: menu
nav:
  title: 方法
  order: 3
---

`k2-portal`提供了一些框架组件，帮助开发者维持应用间的联系和数据请求。

```js
import { api, Widget, utils, portal } from 'k2-portal';
```

## api

api 是前端服务，它将 service 配置自动包装为服务，服务类型目前默认支持的有：

- graphql 建模器 3.0
- gateway BCF 服务接口

开发创建启用服务方式

1. 在`config/portal.ts`配置`nacos.default.service`，输入服务名称和服务地址。
2. 到`config/proxy.ts`中做进一步代理配置。

示例：

```ts
import { api } from 'k2-portal';

// get
api.gateway.post('/xxx', payload);
// post
api.dataService.get('/xxx').then((res) => {
  return res.data || [];
});
```

## appKey

运行时获取，返回应用的 appKey，此设置在 `config/portal.ts` 中定义。

## getAppConfig

获得应用配置，与`useAppConfig`作用相同，区别是此方法为函数。

```ts
import { getAppConfig } from 'k2-portal';

getAppConfig<{ a: 1 }>('case').then((config) => {
  const a = config.a;
});
```

## ButtonPermissionCheck

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

## useAppProps

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

## useAppConfig

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

## useConfigColumns

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

## useButtonPermissionCheck

按钮级别的权限控制，设置`config/portal.ts`的`buttonPermissionCheck`会做全局开关控制。如果开启`nacos`，开关会被线上的设置覆盖。

<Alert type="info">与`ButtonPermissionCheck`组件作用相同，只是应用场景不同。如果在一个表格里，重复渲染 ButtonPermissionCheck 有性能损耗，使用 hooks 的话只会调用一遍</Alert>

```ts
import { useButtonPermissionCheck } from 'k2-portal';

export default () => {
  const canEdit = useButtonPermissionCheck('case.edit');
  return <Button disabled={!canEdit}>编辑</Button>;
};
```

## useChart

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

## utils

工具函数

### isInWidget

- 类型 `boolean`

判断当前应用是否被其他应用引用。

### isInPortal

- 类型 `boolean`

判断当前应用是否被其他应用引用，并且顶层应用是`Portal`。

## portal

- 类型 `object`

portal 全局 api。

### version

- 类型 `string`

当前 Portal 版本号。

### accessToken

- 类型 `string`

登录后的 token。

### currAppKey

- 类型 `string`

当前主应用名称。

```
/web/portal/app/myapp/#/list
返回 'myapp'
```

### currAppPath

- 类型 `string`

当前主应用自身路由的 pathname。

```
/web/portal/app/myapp/#/list?page=1
返回 '/list?page=1'
```

### currAppUrl

- 类型 `string`

当前应用的路径，包含应用自身的路由信息。

```
/web/portal/app/myapp/#/list?page=1
返回 '/myapp/#/list?page=1'
```

### config

- 类型 `object`

主要是 nacos 配置，也有一些 portal 内部配置

### login

- 类型 `() => void`

用户登录，portal 跳转到登录页面。

### logout

- 类型 `() => void`

用户退出。

### openApp

- 类型 `(appKey: string, path?: string, replace?: boolean) => void`

控制 portal 切换主应用。
