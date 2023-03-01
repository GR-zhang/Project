// import { getPublicKey, getPass, login, logout, checkVerify } from '@/api/login/login'
import API from '@/api'
import { getToken, setAuthToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const { cachePrefix } = require('@/settings')
import { JSEncrypt } from "@/utils/jsencrypt.min.js";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    shopId: sessionStorage.getItem('shopId') || ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SHOPID: (state, shopId) => {
    sessionStorage.setItem('shopId', shopId);
    state.shopId = shopId
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password, authcode } = userInfo
    return new Promise((resolve, reject) => {

      // todo: 用户信息占位
      // const data = {
      //   token: 'admin-token',
      //   adminName: 'superAdmin',
      //   avatar: undefined,
      //   userMenu: []
      // }
      // commit('SET_TOKEN', data.token)
      // commit('SET_NAME', data.adminName)
      // commit('SET_AVATAR', data.avatar ? data.avatar : '/images/headPortrait/default.png')
      // setAuthToken(data.token)
      // sessionStorage.setItem(cachePrefix + 'user_info', JSON.stringify(data))
      // resolve(data)

      // 检查验证码
      // API.check_verify({ adminName: username.trim(), code: authcode.trim() }).then(response => {
        // 获取公钥
        API.get_public_key({ adminName: username.trim() }).then(response => {
          const publicKey = response.data
          // // 加密密码
          // API.get_pass({ key: publicKey, pwd: password }).then(response => {
            // 登录
            // const encryptPassword = response

            // 前端加密(不再通过接口加密)
            let crypt = new JSEncrypt({default_key_size: 1024});
			      crypt.setPublicKey(publicKey);
            let encryptPassword = crypt.encrypt(password);

            API.login({ 
              adminName: username.trim(),
              pwd: encryptPassword,
              form: userInfo.form
            }).then(response => {
              const { data = {} } = response
              // if (parseInt(data.accountType) === 0) {
                commit('SET_TOKEN', data.token)
                commit('SET_NAME', data.adminName)
                commit('SET_AVATAR', data.avatar ? data.avatar : '/images/headPortrait/default.png')
                setAuthToken(data.token)
                sessionStorage.setItem(cachePrefix + 'user_info', JSON.stringify(data))
                resolve(data)
              // } else {
              //   reject({ msg: '此账号无权限访问本系统' })
              // }
            }).catch(error => {
              reject(error)
            })
          // }).catch(error => {
          //   reject(error)
          // })
        }).catch(error => {
          reject(error)
        })
      // }).catch(error => {
        // reject(error)
      // })
    })
  },
  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      API.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('permission/SET_ROUTES_STATU', false, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('permission/SET_ROUTES_STATU', false, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
