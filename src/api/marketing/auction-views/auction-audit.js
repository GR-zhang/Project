import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取竞拍审核列表*/
  get_auctionAudit_list({params, data}) {
    return request({
      url: apiPrefix + '/activityAuction/getAuctionAuditList',
      method: 'post',
      params,
      data
    })
  },
  /**审核竞拍*/
  audit_one_auction(data) {
    return request({
      url: apiPrefix + '/activityAuction/auctionAudit',
      method: 'post',
      data
    })
  },
  // export_actionAudit_list({params, data}) {
  //   return request({
  //     url: apiPrefix + '/activityAuction/auctionExport',
  //     method: 'post',
  //     params,
  //     data,
  //     responseType: 'blob'
  //   })
  // },
}