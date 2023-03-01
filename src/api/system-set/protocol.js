import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取协议列表*/
  get_protocol_list(params) {
    return request({
      url: apiPrefix + '/agreement/queryAll',
      method: 'post',
      params
    })
  },
  edit_one_protocol(data) {
    return request({
      url: apiPrefix + '/agreement/addOrUpdate',
      method: 'post',
      data
    })
  }
}