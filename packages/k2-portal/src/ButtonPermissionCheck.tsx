// @ts-ignore
import { api, appKey, sdk } from '@@/plugin-portal/sdk';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { isInPortal } from './utils';

type Props = {
  /** 权限关键字 */
  accessKey: string;
  /** 禁止当前访问key情况下，子组件的属性 */
  forbiddenFieldProps: { [key: string]: any };
  /** 子节点更新依赖项 */
  deps?: any;
};

type AppPermission = { name: string; parent_id: number; id: number };

function flattenChildren(id: number, nodes: AppPermission[]): AppPermission[] {
  return nodes.reduce<AppPermission[]>((prev, curr) => {
    if (curr.parent_id === id) {
      return [...prev, curr, ...flattenChildren(curr.id, nodes)];
    }
    return prev;
  }, []);
}

function mergeHierarchy(data: AppPermission[]) {
  return data.reduce<[string, { appKey: string; operations: string[] }][]>(
    (prev, curr) => {
      if (curr.parent_id === 0) {
        const perm = {
          appKey: curr.name,
          operations: flattenChildren(curr.id, data).map((item) => item.name),
        };
        return [...prev, [curr.name, perm]];
      }
      return prev;
    },
    [],
  );
}

let hasCached = false;
let cache = Promise.resolve(
  new Map<string, { appKey: string; operations: string[] }>(),
);

async function getPurview() {
  if (isInPortal) {
    return sdk.lib.central.userInfo.boxState.purview?.permission ?? new Map();
  }

  // 有过请求，就传缓存
  if (hasCached) {
    return cache;
  }

  const purview = sdk.lib.central.userInfo.boxState.purview;
  if (purview?.isEnable ?? false) {
    cache = api.gateway
      .get<{ attributes: AppPermission }[]>(
        '/bcf-basic-ms/role/getUserAppPermission',
      )
      .then((res: any) => {
        const init = mergeHierarchy(
          res.data?.map((row: any) => row.attributes) ?? [],
        );
        return new Map(init);
      });
    hasCached = true;
  }
  return cache;
}

export const ButtonPermissionCheck: FC<Props> = (props) => {
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!(sdk.lib.central.userInfo.boxState.purview?.isEnable ?? false)) {
      setForbidden(false);
      return;
    }

    getPurview().then((map) => {
      const permitted =
        map.get(appKey)?.operations.includes(props.accessKey) ?? false;
      setForbidden(!permitted);
    });
  }, [props.accessKey]);

  const childrenWithProps = useMemo(() => {
    const { forbiddenFieldProps, accessKey, ...rest } = props;
    return React.Children.map(props.children, (child) => {
      if (forbidden && React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...props.forbiddenFieldProps,
          ...rest,
        });
      }
      return child;
    });
  }, [forbidden, props.deps]);

  return <>{childrenWithProps}</>;
};

export function useButtonPermissionCheck(accessKey: string) {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    if (!(sdk.lib.central.userInfo.boxState.purview?.isEnable ?? false)) {
      setAllow(true);
      return;
    }

    getPurview().then((map) => {
      console.log(map);

      const allow = map.get(appKey)?.operations.includes(accessKey) ?? false;
      setAllow(allow);
    });
  }, [accessKey]);

  return allow;
}
