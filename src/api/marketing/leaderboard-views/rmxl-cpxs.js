import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取 热门系列藏品销售排行 列表*/
  get_RmxlCpxs_list({params, data}) {
    return request({
      url: apiPrefix + '/top/getHotSeriesCollectionTopList',
      method: 'post',
      params,
      data
    })
  },
  /**获取 用户推荐已实名排行 列表*/
  get_YhtjYsm_list({params, data}) {
    return request({
      url: apiPrefix + '/top/getRecommendTopList',
      method: 'post',
      params,
      data
    })
  },
  /**获取 系统藏品销售排行 列表*/
  get_XtCpxs_list({params, data}) {
    return request({
      url: apiPrefix + '/top/getCollectionTopList',
      method: 'post',
      params,
      data
    })
  },
}