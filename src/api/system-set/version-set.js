import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取版本列表*/
  get_version_list(params) {
    return request({
      url: apiPrefix + '/commonVersionManage/listVersionManage',
      method: 'post',
      params
    })
  },
  add_or_edit_one_version(data) {
    return request({
      url: apiPrefix + '/commonVersionManage/modifyVersionManage',
      method: 'post',
      data
    })
  },
  del_one_version(data) {
    return request({
      url: apiPrefix + '/commonVersionManage/deleteVersionManage',
      method: 'post',
      data
    })
  }
}