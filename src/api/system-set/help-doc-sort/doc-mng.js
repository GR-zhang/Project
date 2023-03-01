import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取文档管理列表*/
  get_docMng_list(params) {
    return request({
      url: apiPrefix + '/help/queryHelpDocAll',
      method: 'post',
      params
    })
  },
  add_or_edit_one_docMng(data) {
    return request({
      url: apiPrefix + '/help/addEditHelpDoc',
      method: 'post',
      data
    })
  },
  del_one_docMng(id) {
    return request({
      url: apiPrefix + '/help/deleteHelpDoc',
      method: 'post',
      params: {id}
    })
  }
}