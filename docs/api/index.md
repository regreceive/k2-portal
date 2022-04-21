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

网络请求入口封装，`Portal`预制了 2 个请求服务：

- graphql 建模器 3.0
- gateway BCF 服务接口

每个服务支持 4 种请求方式：

```ts
type CustomService = {
  get: (url: string) => Promise<ResponseData>;
  post: (url: string, data: {}): Promise<ResponseData>;
  put: (url: string, data: {}): Promise<ResponseData>;
  delete: (url: string) => Promise<ResponseData>;
}
```

示例：

```ts
import { api } from 'k2-portal';

// get
api.gateway.get('/xxx?id=1');

// post
api.gateway.post('/xxx', { data: 'hello' });

// put
api.gateway.put('/xxx?id=1', { data: 'hello' });

// delete
api.gateway.delete('/xxx?id=1');
```

## broadcast

- 类型 `(data: any, opts: object ) => void`

应用间广播消息，用于应用通信。

如果是父子应用，可以通过 Widget 的 `appProps` 来传递信息。如果面对多层级应用间通信，就需要 broadcast 进行全局广播了。

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

获得父级应用传给子应用的参数，也可以接收`appDefaultProps`默认传参，用于特定调试场景。

示例：

```ts
import { useAppProps } from 'k2-portal';

export default () => {
  const appProps = useAppProps<{
    param1: Boolean;
    param2: { [key: string]: string };
  }>();

  useEffect(() => {
    console.log('本应用收到了来自父级应用的传参' + JSON.stringify(appProps)));
  }, [appProps]);
};
```

## useMessage

接收全局消息。考虑到某些人为原因，为了避免垃圾消息影响，需要在 portal.ts 中订阅感兴趣的消息字段。

示例：

```ts
import { useMessage } from 'k2-portal';

export default () => {
  const themeName = useMessage('portal.theme');

  useEffect(() => {
    console.log('当前的主题风格是：' + themeName);
  }, [themeName]);
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
