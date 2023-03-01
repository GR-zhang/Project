import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取会员充值列表*/
  get_memberRecharge_list({params, data}) {
    return request({
      url: apiPrefix + '/userDeposit/getUserDeposit',
      method: 'post',
      params,
      data
    })
  },
  audit_one_memberRecharge(params) {
    return request({
      url: apiPrefix + '/userDeposit/updateStatus',
      method: 'post',
      params
    })
  },
}