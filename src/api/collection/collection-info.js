import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  /**获取藏品列表*/
  get_collection_list({params, data}) {
    return request({
      url: apiPrefix + '/collection/selectList',
      method: 'post',
      params,
      data
    })
  },
  /**获取藏品详细信息*/
  get_collection_detailInfo(id) {
    return request({
      url: apiPrefix + '/collection/collectionSelectOne',
      method: 'post',
      params: {id}
    })
  },
  /**添加或编辑*/
  add_or_edit_one_collection(data) {
    return request({
      url: apiPrefix + '/collection/edit',
      method: 'post',
      data      
    })
  },
  /**上架或下架一个藏品*/
  up_or_down_one_collection(data) {
    return request({
      url: apiPrefix + '/collection/coStateUpdate',
      method: 'post',
      data
    })
  },
  /**藏品售罄*/
  collection_soldOut(data) {
    return request({
      url: apiPrefix + '/collection/sellOut',
      method: 'post',
      data
    })
  },
  /**发行nft*/
  publish_nft(data) {
    return request({
      url: apiPrefix + '/collection/issueNft',
      method: 'post',
      data
    })
  },
  /**查看藏品列表*/
  view_collection_list(params) {
    return request({
      url: apiPrefix + '/collection/collectionList',
      method: 'post',
      params
    })
  },
  /**获取动态属性列表*/
  get_dynamicProp_list() {
    return request({
      url: apiPrefix + '/collectionAttrTemplate/queryAll',
      method: 'post'
    })
  }
}