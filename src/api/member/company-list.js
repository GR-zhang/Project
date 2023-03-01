import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取企业列表*/
  get_company_list({params, data}) {
    return request({
      url: apiPrefix + '/company/companyPageList',
      method: 'post',
      params,
      data
    })
  },
  export_company_list(data) {
    return request({
      url: apiPrefix + '/company/exportCompanyData',
      method: 'post',
      data,
      responseType: 'blob'
    })
  },
  audit_one_company(data) {
    return request({
      url: apiPrefix + '/company/companyAudit',
      method: 'post',
      data,
    })
  }
}