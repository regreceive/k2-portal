---
title: 第三方接入
order: 4
toc: menu
---

## 思路引导

`k2-portal`不能直接与第三方平台集成。可采用开发子应用对接第三方，从而间接集成入 Portal 的方式。

需要一个 portal 充当测试环境

```ts
import { useMemo } from 'react';
import { useLocation } from 'umi';
import { Widget } from 'k2-portal';

export default () => {
  const location = useLocation();

  const pathname = useMemo(() => {
    return location.pathname;
  }, [location.pathname]);

  return (
    <Widget
      appRoot
      appProps={{ pathname }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```
