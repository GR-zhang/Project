import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取所有财务设置数据*/
  get_allFinanceSet_data() {
    return request({
      url: apiPrefix + '/userBalanceRecord/getFinanceSetting',
      method: 'post'
    })
  },
  /**设置接口函数*/
  set_withdraw(data) {
    return request({
      url: apiPrefix + '/userBalanceRecord/editWithdrawSetting',
      method: 'post',
      data
    })
  },
  set_recharge(data) {
    return request({
      url: apiPrefix + '/userBalanceRecord/editDepositSetting',
      method: 'post',
      data
    })
  }
}