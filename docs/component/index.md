---
title: 组件
order: 1
toc: menu
nav:
  title: 组件
  order: 4
---

## Widget

子应用容器

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 应用地址，与主应用保持同域 | `string` | `null` |
| appProps | 向应用传递的参数 | `{}` | `{}` |
| appRoot | 是否作为主应用容器，其路由地址将同步到 Portal 应用的地址栏 | `Boolean` | `false` |
| className | 设置 Widget 容器的样式名称 | `string` | `--` |
| style | 设置 Widget 容器的样式 | `{}` | `{}` |

示例：

```ts
export default () => {
  return (
    <div>
      <h1>子应用</h1>
      <Widget
        src="/app1"
        appProps={{ data: 'hello' }}
        style={{ height: 200 }}
      />
    </div>
  );
};
```
