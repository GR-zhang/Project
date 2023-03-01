import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取合成记录列表*/
  get_systhesisRecord_list(data) {
    return request({
      url: apiPrefix + '/activitySynthesizeRecord/list',
      method: 'post',
      data
    })
  },
  /**获取合成记录详情*/
  get_systhesisRecord_detailInfo(recordId) {
    return request({
      url: apiPrefix + '/activitySynthesizeRecord/detail',
      method: 'get',
      params: {recordId}
    })
  }
}