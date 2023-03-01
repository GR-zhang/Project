import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取会员管理列表*/
  get_memberMng_list({params, data}) {
    return request({
      url: apiPrefix + '/user/userInfoPageList',
      method: 'post',
      params,
      data
    })
  },
  add_one_memberMng(data) {
    return request({
      url: apiPrefix + '/user/userInfoAdd',
      method: 'post',
      data
    })
  },
  edit_one_memberMng(data) {
    return request({
      url: apiPrefix + '/user/userInfoEdit',
      method: 'post',
      data
    })
  },
  export_memberMng(data) {
    return request({
      url: apiPrefix + '/user/exportUserDetailData',
      method: 'post',
      data,
      responseType: 'blob'
    })
  },
  balance_recharge(data) {
    return request({
      url: apiPrefix + '/user/userRecharge',
      method: 'post',
      data
    })
  },
}