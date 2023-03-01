import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取白名单列表*/
  get_whitelist_list({params, data}) {
    return request({
      url: apiPrefix + '/whitelist/listWhitelist',
      method: 'post',
      params,
      data
    })
  },
  add_one_whitelist(data) {
    return request({
      url: apiPrefix + '/whitelist/addWhitelist',
      method: 'post',
      data
    })
  },
  edit_one_whitelist(data) {
    return request({
      url: apiPrefix + '/whitelist/updateWhitelist',
      method: 'post',
      data
    })
  },
  del_one_whitelist(whitelistId) {
    return request({
      url: apiPrefix + '/whitelist/delWhitelistInfoById',
      method: 'post',
      params: {whitelistId}
    })
  },
  export_whitelist(data) {
    return request({
      url: apiPrefix + '/whitelist/whitelistExport',
      method: 'post',
      data,
      responseType: 'blob'
    })
  },
  /**获取白名单下的会员列表*/
  get_whitelisted_members(params) {
    return request({
      url: apiPrefix + '/whitelist/getUserListByWhitelistId',
      method: 'post',
      params
    })
  }
}