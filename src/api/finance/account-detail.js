import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取账户明细列表*/
  get_accountDetail_list({params, data}) {
    return request({
      url: apiPrefix + '/userBalanceRecord/getBalanceRecord',
      method: 'post',
      params,
      data
    })
  }
}