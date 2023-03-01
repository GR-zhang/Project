import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取推荐奖列表*/
  get_referralAward_list() {
    return request({
      url: apiPrefix + '/bonus/bonusPageList',
      method: 'post',
      params: {
        pageNum: 1,
        pageSize: 99
      }
    })
  },
  /**设置推荐奖列表*/
  set_referralAward_list(data) {
    return request({
      url: apiPrefix + '/bonus/editBonus',
      method: 'post',
      data: data
    })
  },
  
}