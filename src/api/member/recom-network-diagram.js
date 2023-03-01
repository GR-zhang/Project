import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取推荐网络图数据*/
  get_RecomNetworkDiagram_data({params, data}) {
    return request({
      url: apiPrefix + '/user/listUserRecommendForms',
      method: 'post',
      params,
      data
    })
  }
}