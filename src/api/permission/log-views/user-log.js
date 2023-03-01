import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取用户日志列表*/
  get_userLog_list({params, data}) {
    return request({
      url: apiPrefix + '/logInfo/listUserLogInfo',
      method: 'post',
      params,
      data
    })
  }
}