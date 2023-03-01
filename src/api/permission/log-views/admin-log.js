import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取管理员日志列表*/
  get_adminLog_list({params, data}) {
    return request({
      url: apiPrefix + '/logInfo/listLogInfo',
      method: 'post',
      params,
      data
    })
  }
}