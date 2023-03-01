import Layout from '@/layout'

const routes = [
  {
    path: '/my-route',
    component: Layout,
    meta: {
      title: '一级路由',
      icon: 'lock',
      superRedirect: 'my-route'
    },
    name: 'MyRoute',
    //ps: 临时重定向path,后续使用meta.superRedirect
    redirect: '/my-route/person',
    children: [
      {
        path: 'person',
        component: () => import('@/views/my-route/person'),
        name: 'Person',
        meta: {
          title: '我的',
          superRedirect: '/my-route/person'
        },
      }
    ]
  }
]

export default routes