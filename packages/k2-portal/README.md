# `k2-portal`

Portal 微前端框架，请注意本工具只在(包含) @1.1.15 版本之前兼容老版本 Portal

## 安装方式

```bash
$ yarn add k2-portal@1.1.15
```

## 调用方式

```tsx
import Widget from 'k2-portal/lib/Widget';

export default () => {
  return (
    <>
      <Widget
        src="/web/public/apps/points"
        style={{ height: 200 }}
        appProps={{ points: [] }}
      />
      ;
    </>
  );
};
```

## 参数说明

| 属性      | 说明                         | 类型     | 默认值 |
| --------- | ---------------------------- | -------- | ------ |
| src       | 应用地址，请确保与主应用同域 | `string` | `null` |
| appProps  | 子应用的入参                 | `object` | `null` |
| className | widget 容器的样式名称        | `string` | `null` |
| style     | widget 容器的样式            | `{}`     | `null` |
