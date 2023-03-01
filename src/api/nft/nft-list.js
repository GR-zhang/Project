import request from '@/utils/request'

const apiPrefix = '/api/cast'

export default {
  get_nft_list({params, data}) {
    return request({
      url: apiPrefix + '/nft/nftAssets',
      method: 'post',
      params,
      data
    })
  },
  export_nft_list({params, data}) {
    return request({
      url: apiPrefix + '/nft/exportNftAssets',
      method: 'post',
      params,
      data,
      responseType: 'blob'
    })
  }
}
