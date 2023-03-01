import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { getLocale }  from '@/utils/lang-data-hanlde'

// create an axios instance
const service = axios.create({
  baseURL: window.__ENV__.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Requested-Token'] = getToken()
    }
    config.headers['locale'] = getLocale();
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if(res.data === null ) res.data = {};
    if (res.code === '202' || res.code === '201') {
      // to re-login
      MessageBox.confirm('您已失去登录状态，您可以选择点击取消按钮停留在当前页面，或者重新登录', '退出确认', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(res)
    } else if (typeof res === 'object' && res.code && res.code !== '200' && res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {// code: '200' || 0 是成功的状态码 
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
