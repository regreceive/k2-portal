---
title: 快速上手
order: 2
toc: menu
---

## 脚手架

先找个地方建个空目录:

```shell
$ mkdir myapp && cd myapp
```

通过应用生成器创建项目:

```shell
# 创建应用
npx create-portal-app@2.x

# 创建Portal
npx create-portal-app@2.x --portal
```

## 安装依赖

```shell
yarn install
```

## 启动项目

```shell
$ yarn start

yarn run v1.22.4
warning package.json: No license field
$ umi dev
INFO umi portal plugin.
Bundle with webpack 5...
Starting the development server...
```

在浏览器里打开 [http://localhost:3100/](http://localhost:3100/)，如果创建的是 Portal，那么地址是[http://localhost:8000/](http://localhost:8000/)

## 构建

```bash
$ yarn build

✔ Webpack
  Compiled successfully in 17.17s

 DONE  Compiled successfully in 17167ms                                       8:26:25 PM

Build success.
✨  Done in 20.79s.
```

构建产物默认生成到 `./dist` 下，然后通过 tree 命令查看，

```bash
tree ./dist

./dist
├── index.html
├── umi.css
└── umi.js
```
