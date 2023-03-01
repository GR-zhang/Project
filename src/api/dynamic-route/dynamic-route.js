import request from '@/utils/request'

const apiPrefix = '/api/admin'

export default {
  /**获取所有菜单*/
  get_allMenu(type) {
    return request({
      url: apiPrefix + '/adminMenu/getMenuAll',
      method: 'post',
      params: { type }
    })
  },
  /**添加根菜单*/
  add_one_RootMenu(data) {
    return request({
      url: apiPrefix + '/adminMenu/addMenu',
      method: 'post',
      data
    })
  },
  /**添加子菜单*/
  add_one_sonMenu(data) {
    return request({
      url: apiPrefix + '/adminMenu/addChildMenu',
      method: 'post',
      data
    })
  },
  /**编辑菜单*/
  edit_one_menu(data) {
    return request({
      url: apiPrefix + '/adminMenu/editMenu',
      method: 'post',
      data
    })
  },
  /**删除菜单*/
  del_one_menu(menuId) {
    return request({
      url: apiPrefix + '/adminMenu/deleteMenu',
      method: 'post',
      params: { menuId }
    })
  },
}
