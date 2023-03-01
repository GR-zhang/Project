import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取待提货藏品列表*/
  get_pendingDeliveryCollection_list({params, data}) {
    return request({
      url: apiPrefix + '/deliveryOrder/getDeliveryGoodsList',
      method: 'post',
      params,
      data
    })
  }
}