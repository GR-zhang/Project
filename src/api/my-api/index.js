import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取商品列表*/
  order_test({params, data}) {
    return request({
      url: apiPrefix + '/tradeOrderItems/tradeOrderItemsPageList',
      method: 'post',
      params,
      data
    })
  },
  
}