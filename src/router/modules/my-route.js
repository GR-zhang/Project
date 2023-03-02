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
      },
      {
        path: 'person2',
        component: () => import('@/views/my-route/person2'),
        name: 'Person2',
        meta: {
          title: '我的2',
          superRedirect: '/my-route/person2'
        },
      },
      {
        path: 'person3',
        component: () => import('@/views/my-route/person3'),
        name: 'Person3',
        meta: {
          title: '我的3',
          superRedirect: '/my-route/person3'
        },
      },
      {
        path: 'banner',
        component: () => import('@/views/my-route/banner'),
        name: 'Banner',
        meta: {
          title: 'banner图',
          superRedirect: '/my-route/banner'
        },
      },
    ]
  }
]

export default routes