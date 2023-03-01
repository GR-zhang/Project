import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  check_verify(params) {
    return request({
      url: apiPrefix + '/login/checkCode',
      method: 'post',
      params
    })
  },
  get_public_key(params) {
    return request({
      url: apiPrefix + '/login/getPublicKey',
      method: 'post',
      params
    })
  },
  get_pass(params) {
    return request({
      url: apiPrefix + '/login/getpass',
      method: 'post',
      params
    })
  },
  login(data) {
    return request({
      url: apiPrefix + '/login/login',
      method: 'post',
      data
    })
  },
  get_sliderValidation_data() {
    return request({
      url: apiPrefix + '/captcha/register',
      method: 'post'
    })
  },
  check_sliderValidation(data) {
    return request({
      url: apiPrefix + '/captcha/check',
      method: 'post',
      data
    })
  },
  logout () {
    return request({
      url: apiPrefix + '/login/logout',
      method: 'post'
    })
  }
}
