import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  /**获取补丁列表*/
  get_wgt_list(params) {
    return request({
      url: apiPrefix + '/sysPatchManage/listPatchManage',
      method: 'post',
      params
    })
  },
  add_or_edit_one_wgt(data) {
    return request({
      url: apiPrefix + '/sysPatchManage/modifyPatchManage',
      method: 'post',
      data
    })
  },
  del_one_wgt(data) {
    return request({
      url: apiPrefix + '/sysPatchManage/deletePatchManage',
      method: 'post',
      data
    })
  }
}