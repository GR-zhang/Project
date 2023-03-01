import Layout from '@/layout'

const routes = [
  {
    path: '/permission',
    component: Layout,
    meta: {
      title: '权限管理',
      icon: 'lock',
      superRedirect: 'permission'
    },
    name: 'Permission',
    //ps: 临时重定向path,后续使用meta.superRedirect
    redirect: '/permission/admin',
    children: [
      {
        path: 'admin',
        component: () => import('@/views/permission/admin'),
        name: 'Admin',
        meta: {
          title: '管理员管理',
          superRedirect: '/permission/admin'
        },
      },
      {
        path: 'log-views',
        component: () => import('@/views/permission/sec-view'),
        name: 'LogViews',
        meta: {
          title: '日志记录',
          superRedirect: '/permission/log-views'
        },
        children: [
          {
            path: 'admin-log',
            component: () => import('@/views/permission/log-views/admin-log'),
            name: 'Admin-log',
            meta: {
              title: '管理员日志',
              superRedirect: '/permission/log-views/admin-log'
            },
          },
          {
            path: 'user-log',
            component: () => import('@/views/permission/log-views/user-log'),
            name: 'UserLog',
            meta: {
              title: '用户日志',
              superRedirect: '/permission/log-views/user-log'
            },
          },
          {
            path: 'creator-log',
            component: () => import('@/views/permission/log-views/creator-log'),
            name: 'CreatorLog',
            meta: {
              title: '创作者日志',
              superRedirect: '/permission/log-views/creator-log'
            },
          }
        ]
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'Role',
        meta: {
          title: '角色组',
          superRedirect: '/permission/role'
        },
      },
      {
        path: 'system-init',
        component: () => import('@/views/permission/system-init'),
        name: 'SystemInit',
        meta: {
          title: '系统初始化',
          superRedirect: '/permission/system-init'
        },
      }
    ]
  }
]

export default routes