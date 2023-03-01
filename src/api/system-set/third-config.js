import request from '@/utils/request'

const apiPrefix = '/api/system'

export default {
  // 获取链配置
  get_chainSet() {
    return request({
      url: apiPrefix + '/sysSetting/getChainInfoSetting',
      method: 'post'
    })
  },
  // 设置链配置
  set_chainSet(data) {
    return request({
      url: apiPrefix + '/sysSetting/chainInfoSetting',
      method: 'post',
      data
    })
  },

  // 获取汇付支付
  get_hfpaySet() {
    return request({
      url: apiPrefix + '/sysSetting/getAdaPaySetting',
      method: 'post'
    })
  },
  // 设置汇付支付
  set_hfpaySet(data) {
    return request({
      url: apiPrefix + '/sysSetting/adaPaySetting',
      method: 'post',
      data
    })
  },

  // 获取快递100
  get_express100() {
    return request({
      url: apiPrefix + '/providerApiSetting/getExpressSetting',
      method: 'post'
    })
  },
  // 设置快递100
  set_express100(data) {
    return request({
      url: apiPrefix + '/providerApiSetting/expressSetting',
      method: 'post',
      data
    })
  },

  // 获取微信小程序配置
  get_wxMinipro() {
    return request({
      url: apiPrefix + '/providerApiSetting/getWxLoginSetting',
      method: 'get'
    })
  },
  // 设置微信小程序配置
  set_wxMinipro(data) {
    return request({
      url: apiPrefix + '/providerApiSetting/wxLoginSetting',
      method: 'post',
      data
    })
  },


  // 获取短信类型
  get_realNameType() {
    return request({
      url: apiPrefix + '/sysSetting/getAuthSetting',
      method: 'post'
    })
  },
  // 设置短信类型
  set_realNameType(params) {
    return request({
      url: apiPrefix + '/sysSetting/authSetting',
      method: 'post',
      params
    })
  },
  // 获取短信配置
  get_realNameConfig(type) {
    const configMap = {
      1: '/providerApiSetting/getBaiduAuthSetting',// 百度云
      3: '/providerApiSetting/getQiNiuAuthSetting',// 七牛云
    };

    return request({
      url: apiPrefix + configMap[type],
      method: 'post'
    })
  },
  // 设置实名认证配置
  set_realNameConfig(data) {
    return request({
      url: apiPrefix + '/providerApiSetting/authSetting',
      method: 'post',
      data
    })
  },
  
  // 获取短信类型
  get_smsType() {
    return request({
      url: apiPrefix + '/sysSetting/getSmsSetting',
      method: 'post'
    })
  },
  // 设置短信类型
  set_smsType(params) {
    return request({
      url: apiPrefix + '/sysSetting/smsSetting',
      method: 'post',
      params
    })
  },
  // 获取短信配置
  get_smsConfig(type) {
    if(type == 0) {
      return new Promise((resolve, reject) => {
        resolve({})
      })
    };
    const configMap = {
      2: '/providerApiSetting/getALiSmsSetting',// 阿里云
      3: '/providerApiSetting/getQiNiuSmsSetting',// 七牛云
    };

    return request({
      url: apiPrefix + configMap[type],
      method: 'post'
    })
  },
  // 设置短信配置
  set_smsConfig(data) {
    return request({
      url: apiPrefix + '/providerApiSetting/smsSetting',
      method: 'post',
      data
    })
  },

  // 获取Oss类型
  get_ossType() {
    return request({
      url: apiPrefix + '/providerApiSetting/getOssMethod',
      method: 'get'
    })
  },
  // 设置Oss类型
  set_ossType(params) {
    return request({
      url: apiPrefix + '/providerApiSetting/ossMethod',
      method: 'get',
      params
    })
  },
  // 获取Oss配置
  get_ossConfig(type) {
    const configMap = {
      2: '/providerApiSetting/getAliOssSetting',// 阿里云
      3: '/providerApiSetting/getQiNiuOssSetting',// 七牛云
    };

    return request({
      url: apiPrefix + configMap[type],
      method: 'get'
    })
  },
  // 设置Oss配置
  set_ossConfig(type, data) {
    const configMap = {
      2: '/providerApiSetting/aliOssSetting',// 阿里云
      3: '/providerApiSetting/qiNiuOssSetting',// 七牛云
    };

    return request({
      url: apiPrefix + configMap[type],
      method: 'post',
      data
    })
  },
}