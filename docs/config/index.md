---
title: 配置项
order: 1
toc: menu
nav:
  title: 配置项
  order: 2
---

# 配置项

umi 提供了很多[官方配置](https://umijs.org/zh-CN/config)，使用`create-portal-app`创建项目时已经精选了 umi 几个实用配置。此外`k2-portal`还提供了一些微前端配置项：

```ts
// config/portal.ts
const portal: IConfigFromPlugins['portal'] = {
  appKey: 'app-name',
  role: 'portal',
  nacos: {},
  // more ...
};
```

## nacos

- 类型：`{}`

获得 nacos 线上、或本地开发环境配置。如果应用部署上线，被其他应用集成，则会读取父应用的 nacos 配置

示例：

```js
{
  nacos: {
    url: '/nacos/v1/cs/configs?dataId=dfem.front.portal&group=default',
    default: {
      appRootPathName: '/web/apps',
      service: {
        graphql: '/graphql',
        gateway: '/bcf/api',
      }
      ssoAuthorityUrl: 'https://xxx.xxx/xxxx',
      customLoginApp: 'login',
    },
  },
}
```

### url

nacos 线上地址。开发环境读取线上 nacos 配置，覆盖本地默认配置。不设置 url 则不会覆盖。

### default.appRootPathName

- 类型: `string`
- 默认值：`/web/apps`

应用相对于 web 服务地址所在的路径。这是一个核心配置，如果配置错误，会导致父应用集成子应用失败。

比如`案例中心`应用存放在`/home/k2data/bcf/web/apps/case`，可访问地址`http://xxx.com/web/apps/case/`，配置如下：

```js
{
  appRootPathName: '/web/apps';
}
```

### default.service

- 类型：`Object`
- 默认值：`{ gateway: '', graphql: '' }`

服务接口前端封装。可以预设若干服务接口，自动生成运行时代码，供开发者在请求接口时候调用。

<Alert type="info">在应用范围请按需配置，如果配置了 nacos，相同的接口服务名称会被 nacos 返回的接口服务覆盖。</Alert>

示例：

```js
  service: {
    gateway: '/bcf/api',
  }

// 数据请求时接口服务调用
import { api } from 'k2-portal';
const res = await api.gateway.get('/xxx-service/getXXX?id=1');
```

### default.ssoAuthorityUrl

单点登录。如果应用类型是`portal`，配置单点登录地址打包部署后，项目应用访问产品服务时，接受单点登录授权。 <Alert type="info">为了有好的开发体验，开发环境下，不会受此项控制。</Alert>

### default.customLoginApp

自定义登录应用。如果项目需要登录界面以及授权逻辑定制化，就可以做一个登录应用，部署后配置此应用目录名称。

<Alert type="info">如果单点登录和自定义登录同时存在，框架默认选择单点登录。</Alert>

## 运行配置

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

### role

- 类型：`portal | app`
- 默认值：`app`

当前应用类型，可以选择 portal 或者 app。创建应用模板命令，传递参数与此配置作用一致：

```shell
# portal
npx create-portal-app --portal

# app
npx create-portal-app
```

### devAuth<Badge>开发环境</Badge>

- 类型：`Object`
- 默认值：`{ username: 'admin', password: 'admin' }`

开发环境 Basic 认证。开发环境下，接口请求会走认证网关，有此设置后不需要登录操作，避免返回 401 状态。

<Alert type="info">仅对开发环境有效，此设置不会被打包。</Alert>

示例：

```js
  auth: {
    username: 'test',
    password: 'test',
  }
```

### customToken<Badge>开发环境</Badge>

- 类型：`string`
- 默认值：`null`

开发环境中，与`devAuth`Basic 自动认证方式不同，`customToken`可直接设置 http 消息头`Authorization`，此时`devAuth`的设置将会被覆盖。

示例：

```js
customToken: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InB1YmxpYzpmNzdkNzlhNy0wMjRjLTRiZWQtYTkyNi01N2MxM2UxZGMxNjQiLCJ0eXAiOiJKV1QifQ.eyJh.....';
```

### bundleCommon

- 类型：`{ development: boolean; production: boolean }`
- 默认值：`{ development: false, production: false }`

作为微前端框架，默认在开发环境和生产环境，antd、moment、react、react-dom 等公共库被 webpack 排除在外，不进行打包，统一加载父应用公共库，节省资源加载开销也可以缩短编译时间。如果只是想实现一个单应用场景，并且希望以上公共库和项目打包为一个文件，请设置为`true`。

## 其他配置

`src/app.ts`或`src/app.tsx`文件中，存在一些约定式配置，主要用于运行时应用行为的动态调整。

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
