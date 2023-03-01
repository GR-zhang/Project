import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取盲盒列表*/
  get_blindbox_list({params, data}) {
    return request({
      url: apiPrefix + '/blindBoxInfo/getBlindBoxInfoList',
      method: 'post',
      params,
      data
    })
  },
  add_or_edit_one_blindbox(data) {
    return request({
      url: apiPrefix + '/blindBoxInfo/blindBoxInfoAddEdit',
      method: 'post',
      data
    })
  },
  /**上架或下架一个盲盒(ps: 该接口同时具备删除操作)*/
  up_or_down_one_blindbox(params) {
    return request({
      url: apiPrefix + '/blindBoxInfo/editBlindBoxStatus',
      method: 'post',
      params
    })
  },
  /**获取盲盒详情*/
  get_blindbox_detailInfo(boxId) {
    return request({
      url: apiPrefix + '/blindBoxInfo/getBlindBoxInfo',
      method: 'post',
      params: {boxId}
    })
  }
}