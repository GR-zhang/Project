import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取空投列表*/
  get_airdrop_list({params, data}) {
    return request({
      url: apiPrefix + '/activityAirdrop/getActivityAirdropPageList',
      method: 'post',
      params,
      data
    })
  },
  add_or_edit_one_airdrop(data) {
    return request({
      url: apiPrefix + '/activityAirdrop/activityAirdropAddEdit',
      method: 'post',
      data
    })
  },
  /**开始空投*/
  start_one_airdrop(id) {
    return request({
      url: apiPrefix + '/activityAirdrop/beginAirdrop',
      method: 'post',
      params: {id}
    })
  },
  // export_airdrop(data) {
    // return request({
    //   url: apiPrefix + '/whitelist/whitelistExport',
    //   method: 'post',
    //   data,
    //   responseType: 'blob'
    // })
  // },
  /**获取空投详情*/
  get_airdrop_detailInfo(activityId) {
    return request({
      url: apiPrefix + '/activityAirdrop/activityAirdropSelectOne',
      method: 'post',
      params: {activityId}
    })
  }
}