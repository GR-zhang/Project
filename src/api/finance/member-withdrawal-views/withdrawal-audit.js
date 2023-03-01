import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取提现审批列表*/
  get_withdrawalAudit_list(params) {
    return request({
      url: apiPrefix + '/userWithdraw/getUserWithdraw',
      method: 'post',
      params
    })
  },
  audit_one_withdrawalAudit(params) {
    return request({
      url: apiPrefix + '/userWithdraw/updateStatus',
      method: 'post',
      params
    })
  },
}