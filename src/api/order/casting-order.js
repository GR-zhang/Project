import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取铸造订单列表*/
  get_castingOrder_list({params, data}) {
    return request({
      url: apiPrefix + '/mintOrder/mintOrderPageList',
      method: 'post',
      params,
      data
    })
  }
}