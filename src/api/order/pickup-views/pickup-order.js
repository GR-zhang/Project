import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取提货订单列表*/
  get_pickupOrder_list({params, data}) {
    return request({
      url: apiPrefix + '/deliveryOrder/getDeliveryOrderList',
      method: 'post',
      params,
      data
    })
  },
  /**确认发货*/
  confirm_one_delivery(data) {
    return request({
      url: apiPrefix + '/tlc/confirmDelivery',
      method: 'post',
      data
    })
  },
  /**获取快递公司列表*/
  get_expressCompany_list() {
    return request({
      url: apiPrefix + '/deliveryOrderServiceRecord/getExpressCompany',
      method: 'post',
    })
  },
}