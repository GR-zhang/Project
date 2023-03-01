import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  /**获取系列列表*/
  get_series_list({params, data}) {
    return request({
      url: apiPrefix + '/series/listSeries',
      method: 'post',
      params,
      data
    })
  },
  /**获取系列详情*/
  get_series_detailInfo(seriesId) {
    return request({
      url: apiPrefix + '/series/detail',
      method: 'post',
      params: { seriesId }
    })
  },
  add_one_series(data) {
    return request({
      url: apiPrefix + '/series/addSeries',
      method: 'post',
      data
    })
  },
  edit_one_series(data) {
    return request({
      url: apiPrefix + '/series/updateSeriesById',
      method: 'post',
      data
    })
  },
  del_one_series(seriesId) {
    return request({
      url: apiPrefix + '/series/delSeries',
      method: 'post',
      params: {seriesId}
    })
  },
  export_series(data) {
    return request({
      url: apiPrefix + '/series/seriesExport',
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
}