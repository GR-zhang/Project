import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
const { cachePrefix } = require('@/settings')

// 路由导入
import myRoute from '@/router/modules/my-route'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      let userInfo = sessionStorage.getItem(cachePrefix + 'user_info')
      userInfo = userInfo ? JSON.parse(userInfo) : {}
      // if (parseInt(userInfo.accountType) !== 2) {
      //   await store.dispatch('user/resetToken')
      //   Message.error('此账号无权限访问本系统')
      //   next(`/login`)
      //   NProgress.done()
      // }
      // determine whether the user has obtained his permission roles through getInfo
      const hasSetRoute = store.getters.hasSetRoute
      if (hasSetRoute) {
        next()
      } else {
        try {
          // await store.dispatch('user/getInfo')
          // console.log('userInfo', userInfo);
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', userInfo.userMenu)
          
          // 重定向404路由
          accessRoutes.push({
            path: '*',
            component: () => import('@/views/404'),
            hidden: true
          });

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
