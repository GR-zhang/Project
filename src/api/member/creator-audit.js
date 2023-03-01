import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取创作者审核列表*/
  get_creatorAudit_list({params, data}) {
    return request({
      url: apiPrefix + '/designer/designerAuditPageList',
      method: 'post',
      params,
      data
    })
  },
  export_creatorAudit_list(data) {
    return request({
      url: apiPrefix + '/designer/exportDesignerAuditData',
      method: 'post',
      data,
      responseType: 'blob'
    })
  },
  /**审核创作者*/
  audit_one_creator(data) {
    return request({
      url: apiPrefix + '/designer/designerAudit',
      method: 'post',
      data
    })
  }
}