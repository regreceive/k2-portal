declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.gql';
declare module '*.gql' {
  const content: {
    [key: string]: any;
  };
  export default content;
}
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
declare enum env {
  RUNTIME_NAMESPACE = '',
}

interface Window {
  antd: any;
  React: any;
  ReactDOM: any;
  moment: any;
  $$config: {
    [key: string]: any;
  };
  env: { [key: string]: any };
  g_portal: any;
}
