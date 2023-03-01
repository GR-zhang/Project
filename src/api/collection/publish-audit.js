import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  // ps: 列表与详情使用./collection-info中的接口

  /**审核一个藏品*/
  audit_one_collection(data) {
    return request({
      url: apiPrefix + '/collection/collectionAudit',
      method: 'post',
      data
    })
  }
}