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

## broadcast

- 类型 `(data: any, opts: object ) => void`

应用间广播消息，用于应用通信。

父子应用，可以通过 Widget 的 appProps 来传递信息。broadcast 主要用于多层级应用间通信，实现了一个简易版 redux 的全局状态。

示例：

```ts
import { broadcast } from 'k2-portal';

// 向所有应用发送名称为appName.data数据，消息名称appName.data必须在portal.ts中注册，否则会报错
broadcast({ 'appName.data': [] });
```

| 属性 | 说明            | 类型                  | 默认值 |
| ---- | --------------- | --------------------- | ------ |
| data | 待广播的数据    | `{[key:string]: any}` | `--`   |
| opts | 选项，详见 opts | `object`              | `{}`   |

_options_

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| persist | 缓存到全局历史消息中，新接入应用会第一时间收到 | `boolean` | `false` |

## useAppProps

作为服务化应用，获得当前应用的传参，也可以接收`appDefaultProps`默认传参，用于特定调试场景。

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

## useMessage

接收全局消息。由于人为原因，为了避免垃圾消息影响，需要在 portal.ts 中订阅感兴趣的消息字段。

<Alert type="info">useMessage 实际上是 useAppProps 的一个子集，专门返回消息数据，并且其返回结果带有类型声明。</Alert>

示例：

```ts
import { useMessage } from 'k2-portal';

export default () => {
  const message = useMessage();

  useEffect(() => {
    // bla...
  }, [message['portal.theme']]);
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

### isInWidget

- 类型 `() => boolean`

判断当前应用是否被其他应用引用。

### isInPortal

- 类型 `() => boolean`

### isPortal

- 类型 `() => boolean`

判断当前应用是不是`Portal`。

## portal

### version

- 类型 `string`

当前 Portal 版本号。

### accessToken

- 类型 `string`

登录后的 token。

### currLayout

- 类型 `string`

返回 entry 的布局名称，entry 可通过此项调整自身的布局设置，默认名称 app。

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

- 类型 `(appKey: string, path?: string, opts: object) => void`

控制 portal 切换主应用。

| 属性   | 说明            | 类型     | 默认值 |
| ------ | --------------- | -------- | ------ |
| appKey | 应用 key        | `string` | `null` |
| path   | 应用的 url      | `string` | `/`    |
| opts   | 选项，详见 opts | `object` | `{}`   |

**opts**

| 属性    | 说明                | 类型      | 默认值 |
| ------- | ------------------- | --------- | ------ |
| replace | 路由 replace 方式   | `boolean` | `null` |
| layout  | 通知 entry 切换布局 | `string`  | `app`  |
