import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取售后记录列表*/
  get_afterSaleRecord_list({params, data}) {
    return request({
      url: apiPrefix + '/deliveryOrderServiceRecord/getDeliveryOrderServiceRecordList',
      method: 'post',
      params,
      data
    })
  },
  /**审核一个售后记录*/
  audit_one_afterSaleRecord(params) {
    return request({
      url: apiPrefix + '/deliveryOrderServiceRecord/updateStatus',
      method: 'post',
      params
    })
  },

}