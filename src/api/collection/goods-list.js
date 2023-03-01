import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  /**获取商品列表*/
  get_goods_list({params, data}) {
    return request({
      url: apiPrefix + '/goods/goodsList',
      method: 'post',
      params,
      data
    })
  },
  edit_one_goods(data) {
    return request({
      url: apiPrefix + '/goods/edit',
      method: 'post',
      data
    })
  },
  /**获取nft流转记录列表*/
  get_nftFlowRecord_list(params) {
    return request({
      url: '/api/cast' + '/nft/nftTransfer',
      method: 'post',
      params,
    })
  },
}