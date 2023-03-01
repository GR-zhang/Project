import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取文档分类列表*/
  get_docSort_list(params) {
    return request({
      url: apiPrefix + '/help/queryCategoryAll',
      method: 'post',
      params
    })
  },
  add_or_edit_one_docSort(data) {
    return request({
      url: apiPrefix + '/help/addEditCategory',
      method: 'post',
      data
    })
  },
  del_one_docSort(id) {
    return request({
      url: apiPrefix + '/help/deleteCategory',
      method: 'post',
      params: {id}
    })
  }
}