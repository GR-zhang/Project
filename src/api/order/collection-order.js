import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取藏品订单列表*/
  get_collectionOrder_list({params, data}) {
    return request({
      url: apiPrefix + '/tradeOrderItems/tradeOrderItemsPageList',
      method: 'post',
      params,
      data
    })
  }
}