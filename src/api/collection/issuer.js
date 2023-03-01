import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  /**获取发行方列表*/
  get_issuer_list({params, data}) {
    return request({
      url: apiPrefix + '/distributionCompany/getDistributionCompany',
      method: 'post',
      params,
      data
    })
  },
  /**获取发行方详情*/
  get_issuer_detailInfo(id) {
    return request({
      url: apiPrefix + '/distributionCompany/getDetails',
      method: 'get',
      params: { id }
    })
  },
  add_or_edit_one_issuer(data) {
    return request({
      url: apiPrefix + '/distributionCompany/addOrEdit',
      method: 'post',
      data
    })
  },
  del_one_issuer(id) {
    return request({
      url: apiPrefix + '/distributionCompany/deleteDistributionCompany',
      method: 'get',
      params: {id}
    })
  },
  // export_issuer(data) {
  //   return request({
  //     url: apiPrefix + '/series/seriesExport',
  //     method: 'post',
  //     data,
  //     responseType: 'blob'
  //   })
  // }
}