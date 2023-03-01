import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取创作者日志列表*/
  get_creatorLog_list({params, data}) {
    return request({
      url: apiPrefix + '/logInfo/listDesignerLogInfo',
      method: 'post',
      params,
      data
    })
  }
}