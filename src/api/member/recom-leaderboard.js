import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取推荐排行榜列表*/
  get_recomLeaderboard_list({params, data}) {
    return request({
      url: apiPrefix + '/user/getAllUserDirectRankList',
      method: 'post',
      params,
      data
    })
  }
}