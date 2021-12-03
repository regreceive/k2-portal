---
title: 配置项
order: 1
toc: menu
nav:
  title: 配置项
  order: 2
---

# 配置项

umi 提供了众多配置，本文不展示，直达[官方配置](https://umijs.org/zh-CN/config)。portal 配置示例：

```ts
// config/portal.ts
const portal: IConfigFromPlugins['portal'] = {
  appKey: 'temp',
  service: {
    gateway: '/bcf/api',
    dataService: '/data-service/modeler/api/v2',
  },
};
```

以下展示 k2-portal 自定义的配置

## 编译时配置

编译时配置，只在编译修改生效，运行时不能再动态修改。配置文件位置：`config/portal.ts`

### appKey

- 类型: `string`
- 默认值：`null`

当前应用在建模器中注册的 key 名称，框架内提供的业务函数会调用它。如果没有定义正确的 key，调用业务函数（比如应用配置）会出错。

示例：

```js
{
  appKey: 'case',
}
```

### appDefaultProps

- 类型：`Object`
- 默认值：`{}`

服务化应用的默认入参。基于服务化的思想，应用可以被其它应用调用，但是不可能在开发环境里重现真实场景，所以提供默认入参供调试，同时也是为了避免入参为空的情况下导入应用出错。

示例：

```js
  appDefaultProps: {
    id: 1,
    onChange: () => {}
  }
```

### auth<Badge>develop</Badge>

- 类型：`Object`
- 默认值：`{ username: 'admin', password: 'admin' }`

开发环境 Basic 认证。开发环境下，接口请求会走认证网关，此设置会避免返回 401。

<Alert type="info">仅对开发环境有效，此设置不会被打包。</Alert>

示例：

```js
  auth: {
    username: 'test',
    password: 'test',
  }
```

### service

- 类型：`Object`
- 默认值：`{ dataService: '', datalabModeler: '', gateway: '', influxdb: '', repo: '' }`

通用接口服务封装。可以预设若干服务接口，会自动生成运行时代码，供开发者在请求接口时候调用。

<Alert type="info">在应用范围请按需配置，如果配置了 nacos，相同的接口服务名称会被 nacos 返回的接口服务覆盖。</Alert>

示例：

```ts
  service: {
    dataService: '/data-service/modeler/api/v2',
  }

// 数据请求时接口服务调用
import { api } from 'k2-portal';
const res = await api.dataService.post(
  '/data/namespaces/{namespaces}/entity_types/dfem_case/data/object',
  payload,
);
```

### nacos<Badge>develop</Badge>

- 类型：`string`
- 默认值：`null`

运行时 nacos 的配置地址。此选项是为了配合开发环境的需求，比如在应用里要读取一些 nacos 的配置，而此时应用并没有被 Portal 集成，因此读取不到 Portal 的 nacos。

<Alert type="info">应用部署上线后，应用内的 nacos 网络请求会自动取消，读取到的配置均来自 Portal。</Alert>

<Alert type="info">应用部署上线后，如果作为独立应用访问，仍然会访问 nacos 设置。</Alert>

示例：

```js
{
  nacos: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
}
```

### buttonPermissionCheck

- 类型：`boolean`
- 默认值：`false`

数据操作权限总开关。如果为`true`，在应用当中会对按钮、输入框等控件采取按钮级别的权限控制。如果开启`nacos`，会被线上设置覆盖。

<Alert type="info">此开关需要与`<ButtonPermissionCheck />`这类组件配合使用</Alert>

### integration

- 类型：`{ development: boolean; production: boolean }`
- 默认值：`{ development: true, production: true }`

应用被集成配置。k2-portal 的应用可以在开发环境独立运行，也具备打包部署后独立运行（不需要 Portal 集成）的能力。

默认在开发环境和生产环境都是被集成状态，开发环境设置成集成状态是因为能加快编译速度，这算是个意外收获。

### bearer<Badge>develop</Badge>

- 类型：`string`
- 默认值：`null`

开发环境为了方便权限获取，采用 Basic 自动认证方式。某些特殊场景下，可以将线上的 bearer 直接复制到开发环境中，此时`auth`的设置将会被覆盖。

示例：

```js
bearer: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpmNzdkNzlhNy0wMjRjLTRiZWQtYTkyNi01N2MxM2UxZGMxNjQiLCJ0eXAiOiJKV1QifQ.eyJh.....';
```

### mainApp

- 类型：`Object`
- 默认值：undefined

一旦设置此项，当前应用就转变为`Portal`。一般用于本地开发调试`Entry`，否则调用应用内的`openApp`不起作用。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| appPath | web 服务中应用的绝对路径。比如当前应用`myapp`在 `/web/apps/myapp`位置上，则应该设置`/web/apps` | `string` | `''` |

示例：

```js
  mainApp: {
    appPath: '/public/apps',
  }
```

## 运行时配置

运行时配置请到`src/app.ts`或`src/app.tsx`去声明，如果不存在这个文件请手动创建，系统会自动识别。

### lightTheme

明亮主题样式变量。应用内可以预设两种主题风格的样式，便于应用随 Portal 主题自动切换。

```ts
export const lightTheme = {
  '--custom-bgColor': '#eee',
};
```

### darkTheme

暗黑主题样式变量。应用内可以预设两种主题风格的样式，便于应用随 Portal 主题自动切换。

```ts
export const lightTheme = {
  '--custom-bgColor': '#333',
};
```
