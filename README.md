# k2-portal 微前端应用框架

[![NPM version](https://img.shields.io/npm/v/k2-portal.svg?style=flat)](https://npmjs.org/package/k2-portal) [![NPM downloads](http://img.shields.io/npm/dm/k2-portal.svg?style=flat)](https://npmjs.org/package/k2-portal)

查看使用文档 [DOC](https://k2-portal.vercel.app/)

[Demo](https://k2-portal-demo.vercel.app/)

## 这个框架的意义

市面上已经有很多优秀微前端框架，但都是一些通用功能的实现，即它可以帮你把不同的 app 合到一起来展现，但是这一切并不包含特定的业务场景。

我尝试过去改写主流的框架来实现所供职公司的一些业务，但发现整个过程变得很繁琐且复杂，我需要一个可以自己完全控制、配置简便含有通用业务场景的微前端框架。

这些业务场景，如统一登录认证、接口请求、graphql 集成、nacos 运行时环境变量，其实就是企业级应用的基本需求，有了它开发者们会从繁琐的通用业务设计中解脱出来，从而专注于功能开发。

## 基于 Umi

k2-portal 实质是 umi 的插件，所以运行这个框架的前提是你的项目要基于 umi，如果是新建项目的话很容易很多，因为我提供了项目模板，可以一键生成项目。

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
