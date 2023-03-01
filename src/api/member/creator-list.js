import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取创作者列表*/
  get_creator_list({ params, data}) {
    return request({
      url: apiPrefix + '/designer/designerPageList',
      method: 'post',
      params,
      data
    })
  },
  add_one_creator(data) {
    return request({
      url: apiPrefix + '/designer/designerAdd',
      method: 'post',
      data
    })
  },
  edit_one_creator(data) {
    return request({
      url: apiPrefix + '/designer/designerEdit',
      method: 'post',
      data
    })
  },
  export_creator_list(data) {
    return request({
      url: apiPrefix + '/designer/exportDesignerData',
      method: 'post',
      data,
      responseType: 'blob'
    })
  },
  /**获取创作者详细信息*/
  get_creator_detailInfo(designerId) {
    return request({
      url: apiPrefix + '/designer/designerSelectOne',
      method: 'post',
      params: {designerId}
    })
  }
}