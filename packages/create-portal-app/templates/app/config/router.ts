import { IBestAFSRoute } from '@umijs/plugin-layout/src/types/interface';

const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '.',
        component: '@/pages/Home',
        title: 'App Demo',
      },
      {
        path: './other-page',
        component: '@/pages/OtherPage',
      }
    ],
  }
];

export default routes;
