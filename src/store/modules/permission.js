import { constantRoutes } from '@/router'
import API from '@/api'
import { hideRouteNames } from '@/settings'

import Layout from '@/layout'
import myRoute from '@/router/modules/my-route'


// 路由懒加载
const loadView = (view) => { 
  return (resolve) => require([`@/views${view}`], resolve)
}
/**step1: 异步路由过滤*/
export function filterAsyncRoutes (asyncRoutes, authRouteNames) {
  // console.log('asyncRoutes', asyncRoutes);
  // console.log('authRouteNames', authRouteNames);

  const res = [];
  
  asyncRoutes.forEach(route => {
    let routeItem = {};
    
    //authRouteNames=[]是 超级管理员 角色,拥有全部权限
    if (
      authRouteNames.length == 0
      ||
      authRouteNames.includes(route.menuRoute)
    ) {
      if(!hideRouteNames.includes(route.menuRoute)) {
        routeItem = { 
          path: route.menuPath,
          meta: {
            title: route.menuName,
            icon: route.icon,
            superRedirect: route.superRedirect
          },
          name: route.menuRoute,
        };
        
        // 设置component对应组件
        if(route.component == 'Layout') {
          routeItem.component = Layout;
        }else {
          routeItem.component = loadView(route.component);
        }

        if(route.child && route.child.length != 0) {
          // 递归
          routeItem.children = filterAsyncRoutes(route.child, authRouteNames);
        }

        res.push(routeItem);
      }
    }
  })
  
  return res
}
/**step2: 设置异步路由默认重定向路径与操作按钮访问权限*/
export function retrofitRoutes(routes_filter, authBtnNames) {
  return routes_filter.map((route) => {
    if(!route.children) {
      route.meta.authBtnNames = authBtnNames.filter(item => item.split('-')[0] === route.path);
    }

    if(route.children && route.children.length != 0) {
      route.redirect = route.children[0] && route.children[0].meta.superRedirect;
      // 递归
      retrofitRoutes(route.children, authBtnNames);
    }

    return route;
  })
}

const state = {
  routes: [],
  addRoutes: [],
  hasSetRoute: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTES_STATU: (state, statu) => {
    state.hasSetRoute = statu
  }
}

const actions = {
  generateRoutes: async ({ commit }, userMenu) => {
    // console.log('userMenu', userMenu);
    // 拆分路由和按钮权限
    let authRouteNames = [];
    let authBtnNames = [];
    userMenu.forEach(item => {
      if(item.menuRoute.includes('#')) {
        authBtnNames.push(item.menuRoute);
      }else {
        authRouteNames.push(item.menuRoute);
      }
    })
    // console.log('authRouteNames', authRouteNames);
    // console.log('authBtnNames', authBtnNames);

    // 获取异步路由菜单
    let res = await API.get_allMenu(1);
    let asyncRoutes = res.data || [];
    // console.log('asyncRoutes', asyncRoutes);

    return new Promise(resolve => {
      let routes_filter = filterAsyncRoutes(asyncRoutes, authRouteNames);
      // console.log('routes_filter', routes_filter);
      let accessedRoutes = retrofitRoutes(routes_filter, authBtnNames);

      accessedRoutes.push(myRoute[0])
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_ROUTES_STATU', true)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
