import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取得到盲盒列表*/
  get_getBlindboxUsers_list(params) {
    return request({
      url: apiPrefix + '/blindBoxInfo/getBlindBoxUserRecord',
      method: 'post',
      params
    })
  }
}