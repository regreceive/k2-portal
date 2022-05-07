# k2-portal 微前端应用框架

[![NPM version](https://img.shields.io/npm/v/k2-portal.svg?style=flat)](https://npmjs.org/package/k2-portal) [![NPM downloads](http://img.shields.io/npm/dm/k2-portal.svg?style=flat)](https://npmjs.org/package/k2-portal) [![install size](https://packagephobia.com/badge?p=k2-portal)](https://packagephobia.com/result?p=k2-portal) [![brotli](https://badgen.net/bundlephobia/minzip/k2-portal)](https://bundlephobia.com/result?p=k2-portal)

查看使用文档 [DOC](https://k2-portal.vercel.app/)

[Demo](https://k2-portal-demo.vercel.app/)

## 为什么用 k2-portal

市面上已经有很多优秀的微前端框架，可以帮你把不同的 app 合到一起来展现，但因为要考虑到通用性，所以这些不会包含特定的业务场景。

我也曾使用开源的微前端框架去打散、整合企业应用，对相似重复的业务逻辑做封装。但随着封装的深入，以至于必须要改写微前端框架的代码。理解、改写开源代码以及同步来自官方的更新是另一个量级的工作，从时间和复杂度来说，开发一个自己完全控制、配置简便且含有通用业务场景的微前端框架是非常必要的。

目前已经实现的业务场景，包含:

- 统一登录认证([单点登录](https://github.com/IdentityModel/oidc-client-js))
- 统一接口请求
- graphql 集成
- 统一运行时环境变量([Nacos](https://github.com/alibaba/nacos))
- 统一前端主题风格

基于具备通用业务逻辑的微前端框架，开发者会节省更多的时间来专注于应用的纯功能开发。

## 基于 Umi

k2-portal 实质是 [umi](https://github.com/umijs/umi) 的插件，所以运行这个框架的前提是你的项目要基于 umi，如果是新项目的话请使用 k2-portal 的项目模板，可以一键生成项目。

## 创建微前端

**创建主应用**

```shell
$ mkdir portal
$ cd portal
npx create-portal-app@2.x --portal
```

**创建子应用**

```shell
$ mkdir app
$ cd app
npx create-portal-app@2.x
```

## 安装依赖

```shell
yarn install
```

## 启动项目

```shell
$ yarn start
```

---

## LICENSE

MIT
