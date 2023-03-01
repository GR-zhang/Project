import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取优先购活动列表*/
  get_buyFirst_list({params, data}) {
    return request({
      url: apiPrefix + '/activityPreemptive/getActivityPreemptiveList',
      method: 'post',
      params,
      data
    })
  },
  add_or_edit_one_buyFirst(data) {
    return request({
      url: apiPrefix + '/activityPreemptive/activityPreemptiveAddEdit',
      method: 'post',
      data
    })
  },
  del_one_buyFirst(activityId) {
    return request({
      url: apiPrefix + '/activityPreemptive/deleteActivityPreemptive',
      method: 'post',
      params: {activityId}
    })
  }
}