---
title: 进阶使用
order: 3
toc: menu
---

## 应用服务化

应用打包部署后，可以被其它应用引用，通过传输参数来改变应用的行为。

示例，嵌入一个测点展示应用：

```ts
import { Widget } from 'k2-portal';

export default () => {
  return (
    <>
      <div>测点展示demo</div>
      <Widget
        src="/web/public/apps/points"
        style={{ height: 200 }}
        appProps={{ points: [] }}
      />;
    </>
  );
};
```

### 让自己的应用对外提供服务

上面调用测点应用的示例，其中 appProps 是应用入参，在测点应用中是这样接收入参的：

```ts
import { useAppProps } from 'k2-portal';

export default () => {
  const appProps = useAppProps<{ points: any[] }>();

  return (
    <>
      <div>我是测点应用，接收到的测点列表</div>
      <div>{JSON.stringify(appProps.points)}</div>
    </>
  );
};
```

### 设置入参默认值

可以对应用入参设置默认值，这样做的好处是：

1. 避免调用者没有传入相关参数导致程序错误
2. 便于调试，作为服务化应用只需要模拟一个真实环境传入的参数即可

找到`config/portal.ts`，新增 appDefaultProps 字段，设置入参的默认值

```ts
import { IConfigFromPlugins } from '@@/core/pluginConfig';

const portal: IConfigFromPlugins['portal'] = {
  appKey: 'demo',

  appDefaultProps: {
    points: [],
  },
};

export default portal;
```

### 系统默认入参

除了以上自定义的入参之外，系统会默认传入一些入参，可以协助在应用中适配不同的运行场景：

| 属性     | 说明                   | 类型              | 默认值  |
| -------- | ---------------------- | ----------------- | ------- |
| theme    | 主题                   | `light` \| `dark` | `light` |
| asWidget | 是否作为服务化应用启动 | `boolean`         | `null`  |

## 应用动态主题

如果应用被集成入`Portal`，会接收来自 `Portal` 风格切换的参数。应用中的`antd`组件会自动切换风格，与`Portal`保持统一。

但应用会有一些自定义的样式，比如定义了一个`div`的背景为白色，在白色主题下看着没有问题，如果换成暗黑风格会显得突兀，所以需要手动适配主题的切换。

在`src/app.tsx`或`src/app.ts`下，暴露出两个对象，它们是由`k2portal`预制的：

```ts
export const lightTheme = {
  '--myApp-bgColor': '#fff',
};

export const darkTheme = {
  '--myApp-bgColor': '#000',
};
```

在需要引用这个 css 变量的位置，做如下修改，这样就可以跟随`Portal`换肤：

```less
.box {
  background-color: var(--myApp-bgColor);
}
```

## 自定义接口服务

如果在开发过程中需要新增一个接口服务，比如`repo`。

修改`config/portal.ts`，增加一个 service

```ts
// portal.ts
const portal: IConfigFromPlugins['portal'] = {
  nacos: {
    default: {
      service: {
        repo: '/repo/repos/xxx',
      },
    },
  },
};
```

成功！可以直接使用了

```ts
import { api } from 'k2-portal';

api.repo.get('/columns').then((res) => {
  // bla...
});
```

- 😆 不用创建 nacos 相关接口地址
- 😁 因为不是全局配置，防止和其它同事冲突

<Alert type="warning">为方便管理需要统一从 nacos 取服务配置，怎么做？</Alert>

✨ 答：在 nacos 添加相同的服务接口名称和地址，应用会优先选择 nacos 的配置。

## 支持建模器 3.0

框架支持建模器 3.0，在构建阶段对 graphql 文件（.gql、.graphql）进行解析包装，使 graphql 能够直接变成服务。

```graphql
# service.gql

# 请求菜单
query menu {
  bcf_front_menu {
    title
    app_key
  }
}

#请求应用
query apps {
  bcf_front_apps {
    key
    name
  }
}
```

Promise 模式，graphql 被自动装配请求函数，需要配置 nacos 的 service.graphql

```ts
import { useEffect, useState } from 'react';
import query from './service.gql';

export default () => {
  const [result, setResult] = useState();
  useEffect(() => {
    query.menu.send().then((res) => {
      setResult(res.data);
    });
  }, []);

  return <div>菜单信息：{JSON.stringify(result, null, 2)}</div>;
};
```

也可以使用`@apollo/client`的 hooks 模式，满足不同场景。k2-portal 做了部分引用，具体命令详见[阿波罗官网](https://www.apollographql.com/docs/react/data/queries)

```ts
import { useQuery } from 'k2-portal';
import query from './service.gql';

export default () => {
  const { data, loading } = useQuery(query.apps.gql);

  return <div>应用信息：{JSON.stringify(data, null, 2)}</div>;
};
```
