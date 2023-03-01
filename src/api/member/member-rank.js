import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取会员等级列表*/
  get_memberRank_list({params, data}) {
    return request({
      url: apiPrefix + '/user/userLevelPageList',
      method: 'post',
      params,
      data
    })
  },
  add_one_memberRank(data) {
    return request({
      url: apiPrefix + '/user/userLevelAdd',
      method: 'post',
      data
    })
  },
  edit_one_memberRank(data) {
    return request({
      url: apiPrefix + '/user/userLevelEdit',
      method: 'post',
      data
    })
  },
  del_one_memberRank(leveId) {
    return request({
      url: apiPrefix + '/user/userLevelDelete',
      method: 'post',
      params: {leveId}
    })
  },

  /**获取等级变动历史列表*/
  get_rankChangeHistory_list(params) {
    return request({
      url: apiPrefix + '/user/userLevelRecordPageList',
      method: 'post',
      params
    })
  }
}