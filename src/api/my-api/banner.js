import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  // 获取轮播图列表 
  get_banner_list(params){
    return request({
      url: apiPrefix + '/carousel/queryAll',
      method : 'post',
      params
    })
  },
  add_or_edit_one_banner(data){
    return request({
      url: apiPrefix + '/carousel/addOrUpdate',
      method : 'post',
      data
    })
  },
  del_one_banner(id){
    return request({
      url: apiPrefix + '/carousel/removeById',
      method : 'get',
      params:{id}
    })
  },

}