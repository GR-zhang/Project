import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**异步路由*/
// import collectionRoutes from '@/router/modules/collection'
// import memberRoutes from '@/router/modules/member'
// import permissionRoutes from '@/router/modules/permission'
// import systemSetRoutes from '@/router/modules/system-set'
// import orderRoutes from '@/router/modules/order'
// import financeRoutes from '@/router/modules/finance'
// import bonusRoutes from '@/router/modules/bonus'
// import marketingRoutes from '@/router/modules/marketing'
// import nftRoutes from '@/router/modules/nft'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/dashboard',
    meta: {
      title: '控制台',
      icon: 'dashboard',
      noChild: true,
      superRedirect: 'dashboard'
    },
    name: 'Dashboard',
    activeMenu: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '控制台'},
      // 修正路由name重复
      name: '_Dashboard',
    }]
  },
  
  // ...nftRoutes,
  // ...memberRoutes,
  // ...collectionRoutes,
  // ...permissionRoutes,
  // ...systemSetRoutes,
  // ...orderRoutes,
  // ...financeRoutes,
  // ...bonusRoutes,
  // ...marketingRoutes
]

// 动态路由页面
if(process.env.NODE_ENV == 'development') {
  constantRoutes.unshift({
    path: '/dynamic-route',
    component: Layout,
    redirect: '/dynamic-route/dynamic-route',
    meta: {
      title: '动态路由',
      icon: 'tree-table',
      noChild: true,
      superRedirect: 'dynamic-route'
    },
    name: 'DynamicRoute',
    activeMenu: 'dynamic-route',
    children: [{
      path: 'dynamic-route',
      component: () => import('@/views/dynamic-route/index'),
      meta: {
        title: '动态路由',
        superRedirect: '/dynamic-route/dynamic-route'
      },
      // 修正路由name重复
      name: '_DynamicRoute',
    }]
  })
}


/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [

// ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
