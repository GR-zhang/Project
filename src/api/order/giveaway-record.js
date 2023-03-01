import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取转赠记录列表*/
  get_giveawayRecord_list({params, data}) {
    return request({
      url: apiPrefix + '/donationOrder/myOrders',
      method: 'post',
      params,
      data
    })
  }
}