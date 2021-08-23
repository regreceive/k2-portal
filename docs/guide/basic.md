---
title: 进阶使用
order: 3
toc: menu
---

## 应用服务化

应用服务化的本质就是利用 `iframe` 嵌入应用，并传入一些控制参数，来改变嵌入应用的行为。在实际使用过程中，借助 Portal 的特性，开发者调用应用是感知不到 iframe 这一方式的，从而使调用应用这一过程变得十分简单。

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

找到`config/portal.ts`，新增 appDefaultProps 字段，在里面设置入参的默认值

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

如果应用被集成入`Portal`，则自身不含 `antd` 组件，提供 ui 组件服务来自`Portal`。这样的好处是组件主题风格随 `Portal` 统一切换。

但应用会有一些自定义的样式，比如定义了一个`div`的背景为白色，在白色主题下看着没有问题，如果换成暗黑风格会显得太突兀，所以需要自动适配主题的切换。

在`src/app.tsx`或`src/app.ts`下，暴露出两个对象，它们是由`k2portal`预制的：

```ts
export const lightTheme = {
  '--myApp-bgColor': '#fff',
};

export const darkTheme = {
  '--myApp-bgColor': '#000',
};
```

在需要引用这个 css 变量的位置，做如下修改，这样就可以动态适配`Portal`的换肤：

```less
.box {
  background-color: var(--myApp-bgColor);
}
```
