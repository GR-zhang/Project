import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取公告列表*/
  get_announcement_list(params) {
    return request({
      url: apiPrefix + '/notice/queryAll',
      method: 'post',
      params
    })
  },
  add_or_edit_one_announcement(data) {
    return request({
      url: apiPrefix + '/notice/addOrUpdate',
      method: 'post',
      data
    })
  },
  del_one_announcement(id) {
    return request({
      url: apiPrefix + '/notice/removeById',
      method: 'get',
      params: {id}
    })
  }
}