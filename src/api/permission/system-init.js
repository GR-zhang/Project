import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**系统初始化*/
  system_init() {
    return request({
      url: apiPrefix + '/setUp/sysInit',
      method: 'post'
    })
  }
}