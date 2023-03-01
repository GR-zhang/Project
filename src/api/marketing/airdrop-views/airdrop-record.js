import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取空投记录列表*/
  get_airdropRecord_list({params, data}) {
    return request({
      url: apiPrefix + '/activityAirdropRecord/activityAirdropRecord_page_list',
      method: 'post',
      params,
      data
    })
  }
}