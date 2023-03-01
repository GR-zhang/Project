import request from '@/utils/request'

const apiPrefix = '/api/order'

export default {
  /**获取售后设置数据*/
  get_afterSaleSet_data(data = {}) {
    return request({
      url: apiPrefix + '/deliveryOrderServiceRecord/manageAddressSetting',
      method: 'post',
      data
    })
  },
}