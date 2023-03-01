import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取合成套餐列表*/
  get_systhesisCombo_list(data) {
    return request({
      url: apiPrefix + '/activitySynthesizePackage/list',
      method: 'post',
      data
    })
  },
  add_or_edit_one_systhesisCombo(data) {
    return request({
      url: apiPrefix + '/activitySynthesizePackage/save',
      method: 'post',
      data
    })
  },
  del_one_systhesisCombo(id) {
    return request({
      url: apiPrefix + '/activitySynthesizePackage/del',
      method: 'get',
      params: {id}
    })
  },
  /**开启或关闭合成套餐*/
  open_or_close_one_systhesisCombo(params) {
    return request({
      url: apiPrefix + '/activitySynthesizePackage/changeActivityStatus',
      method: 'get',
      params
    })
  },
  /**获取合成套餐详情*/
  get_systhesisCombo_detailInfo(id) {
    return request({
      url: apiPrefix + '/activitySynthesizePackage/detail',
      method: 'get',
      params: {id}
    })
  }
}