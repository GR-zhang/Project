import request from '@/utils/request'

const apiPrefix = '/api/collection'

export default {
  /**获取运费模板列表*/
  get_shippingTemplate_list({params, data}) {
    return request({
      url: apiPrefix + '/shippingTemplate/listShippingTemplates',
      method: 'post',
      params,
      data
    })
  },
  add_one_shippingTemplate(data) {
    return request({
      url: apiPrefix + '/shippingTemplate/addShippingTemplate',
      method: 'post',
      data
    })
  },
  edit_one_shippingTemplate(data) {
    return request({
      url: apiPrefix + '/shippingTemplate/updateShippingTemplateById',
      method: 'post',
      data
    })
  },
  del_one_shippingTemplate(shippingId) {
    return request({
      url: apiPrefix + '/shippingTemplate/delShippingTemplate',
      method: 'post',
      params: {shippingId}
    })
  },
}