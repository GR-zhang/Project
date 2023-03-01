import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取管理员列表*/
  get_admin_list(params) {
    return request({
      url: apiPrefix + '/adminInfo/adminInfoPageList',
      method: 'post',
      params
    })
  },
  add_one_admin(data) {
    return request({
      url: apiPrefix + '/adminInfo/adminInfoAdd',
      method: 'post',
      data
    })
  },
  edit_one_admin(data) {
    return request({
      url: apiPrefix + '/adminInfo/adminInfoEdit',
      method: 'post',
      data
    })
  },
  del_one_admin(id) {
    return request({
      url: apiPrefix + '/adminInfo/adminInfoDelete',
      method: 'post',
      params: {id}
    })
  }
}