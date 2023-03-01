import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取所有基础设置数据*/
  get_allBaseSet_data() {
    return request({
      url: apiPrefix + '/sysSetting/getSettings',
      method: 'get'
    })
  },
  /**设置接口函数*/
  set_createFuel(data) {
    return request({
      url: apiPrefix + '/sysSetting/gasSetting',
      method: 'post',
      data
    })
  },
  set_transactionFunc(data) {
    return request({
      url: apiPrefix + '/sysSetting/marketSetting',
      method: 'post',
      data
    })
  },
  set_imgSet(data) {
    return request({
      url: apiPrefix + '/sysSetting/systemSetting',
      method: 'post',
      data
    })
  },
  set_walletAddress(data) {
    return request({
      url: apiPrefix + '/sysSetting/walletSetting',
      method: 'post',
      data
    })
  },
  set_downloadAddress(data) {
    return request({
      url: apiPrefix + '/sysSetting/appDownloadSetting',
      method: 'post',
      data
    })
  },
  set_platformPaymentMethod(data) {
    return request({
      url: apiPrefix + '/sysSetting/paymentSetting',
      method: 'post',
      data
    })
  }
}