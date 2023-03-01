import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取角色列表*/
  get_role_list(params) {
    return request({
      url: apiPrefix + '/adminRole/adminRolePageList',
      method: 'post',
      params
    })
  },
  add_or_eidt_one_role(data) {
    return request({
      url: apiPrefix + '/adminRole/adminRoleAddEdit',
      method: 'post',
      data
    })
  },
  del_one_role(roleId) {
    return request({
      url: apiPrefix + '/adminRole/adminRoleDelete',
      method: 'post',
      params: {roleId}
    })
  },
  toggle_one_role(params) {
    return request({
      url: apiPrefix + '/adminRole/roleStatusUpdate',
      method: 'post',
      params
    })
    
  },
  

  /**获取角色组当前菜单*/
  get_role_menu(roleId) {
    return request({
      url: apiPrefix + '/adminRole/adminRoleDetail',
      method: 'post',
      params: {roleId}
    })
  },
}