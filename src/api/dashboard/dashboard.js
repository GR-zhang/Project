import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取交易订单数据*/
  get_tradeOrder_data(params) {
    return request({
      url: apiPrefix + '/dsc/oneOrderStatistics',
      method: 'post',
      params
    })
  },
  /**获取概况数据*/
  get_profile_data(params) {
    let apiUrl = params.profileType == 1 ? '/dsc/memberStatistics' : '/dsc/DesignerMemberStatistics';

    return request({
      url: apiPrefix + apiUrl,
      method: 'post'
    })
  },
  /**获取藏品销售额数据*/
  get_collectionSaleNum_data() {
    return request({
      url: apiPrefix + '/dsc/statisticsGoodsSaleSum',
      method: 'post'
    })
  },
  /**获取订单数量数据*/
  get_orderAmount_data() {
    return request({
      url: apiPrefix + '/dsc/statisticsOrderCount',
      method: 'post'
    })
  },
  /**获取藏品销售额趋势数据*/
  get_collectionSaleNumTrend_data(days) {
    return request({
      url: apiPrefix + '/dsc/statisticsGoodsSaleTrend',
      method: 'post',
      params: {days}
    })
  },
  /**获取订单销售趋势数据*/
  get_orderSaleTrend_data(days) {
    return request({
      url: apiPrefix + '/dsc/statisticsOrderTrend',
      method: 'post',
      params: {days}
    })
  },
}
