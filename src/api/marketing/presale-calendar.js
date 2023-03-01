import request from '@/utils/request'

const apiPrefix = '/api/activity'

export default {
  /**获取预售日历列表*/
  get_presaleCalendar_list({params, data}) {
    return request({
      url: apiPrefix + '/activityPreSaleCalendar/getActivityPreSaleCalendarList',
      method: 'post',
      params,
      data
    })
  }
}