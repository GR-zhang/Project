import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取奖金明细列表*/
  get_bonusDetail_list({params, data}) {
    return request({
      url: apiPrefix + '/bonus/bonusBalanceRecord',
      method: 'post',
      params,
      data
    })
  }
}