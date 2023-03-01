import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取创作者版税佣金列表*/
  get_creatorRoyaltyCommission_list() {
    return request({
      url: apiPrefix + '/bonus/getDesignerBonus',
      method: 'post'
    })
  },
  /**设置创作者版税佣金列表*/
  set_creatorRoyaltyCommission_list(data) {
    return request({
      url: apiPrefix + '/bonus/editDesignerBonus',
      method: 'post',
      data: data
    })
  }
}