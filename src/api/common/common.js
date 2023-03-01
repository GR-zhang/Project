import request from '@/utils/request'

export default {
  // 单文件上传
  upload_single_file(data) {
    return request({
      url: '/api/file' + '/file/uploadObjectOSS',
      method: 'post',
      data
    })
  },
  // 获取语言列表
  get_lang_list() {
    return request({
      url: '/api/system' + '/sysSetting/getLangSetting',
      method: 'post',
    })
  },
  // 获取默认语言
  get_defaultLang() {
    return request({
      url: '/api/system' + '/sysSetting/getDefaultLang',
      method: 'post'
    })
  },
}