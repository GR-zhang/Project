import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取竞拍协议列表*/
  get_auctionProtocol_list(params) {
    return request({
      url: '/api/system' + '/agreement/queryAuctionAgreement',
      method: 'post',
      params
    })
  },

  /**获取竞拍所有设置数据*/
  get_allAuctionSet_list() {
    return request({
      url: apiPrefix + '/activityAuction/getAuctionFeeRatio',
      method: 'post' 
    })
  },
  /**设置数据*/
  set_auctionHandlingFree(data) {
    return request({
      url: apiPrefix + '/activityAuction/editAuctionFeeRatio',
      method: 'post',
      data
    })
  },
  set_auctionTime(data) {
    return request({
      url: apiPrefix + '/activityAuction/editAuctionTimeSetting',
      method: 'post',
      data
    })
  },
}