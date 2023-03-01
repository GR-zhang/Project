import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取竞拍列表*/
  get_auction_list({params, data}) {
    return request({
      url: apiPrefix + '/activityAuction/getActivityAuctionList',
      method: 'post',
      params,
      data
    })
  },
  add_or_edit_one_auction(data) {
    return request({
      url: apiPrefix + '/activityAuction/addEditActivityAuction',
      method: 'post',
      data
    })
  },
  export_action_list({params, data}) {
    return request({
      url: apiPrefix + '/activityAuction/auctionExport',
      method: 'post',
      params,
      data,
      responseType: 'blob'
    })
  },
  /**获取保证金记录列表*/
  get_marginRecord_list(params) {
    return request({
      url: apiPrefix + '/activityAuction/getAuctionDepositList',
      method: 'post',
      params
    })
  },
  /**获取出价记录列表*/
  get_bidRecord_list(params) {
    return request({
      url: apiPrefix + '/activityAuction/getAuctionRecordList',
      method: 'post',
      params
    })
  },
}