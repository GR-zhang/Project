export default {
  // 创作者类型
  creatorType: {
    1: {tagText: '个人认证', tagType: 'info'},
    2: {tagText: '企业认证', tagType: 'warning'},
  },
  // 布尔状态
  booleanStatus: {
    1: {tagText: '是', tagType: 'success'},
    2: {tagText: '否', tagType: 'danger'},
  },
  // 上架状态
  publishStatus: {
    2: {tagText: '已上架', tagType: 'success'},
    1: {tagText: '已下架', tagType: 'danger'},
  },
  // 用户状态
  userStatus: {
    1: {tagText: '开启', tagType: 'success'},
    2: {tagText: '关闭', tagType: 'danger'},
  },
  // 审核状态
  auditStatus: {
    1: {tagText: '审核中', tagType: 'primary'},
    2: {tagText: '已通过', tagType: 'success'},
    3: {tagText: '已拒绝', tagType: 'danger'},
  },
  // 藏品类型
  collectionType: {
    1: {tagText: '虚拟藏品', tagType: 'warning'},
    2: {tagText: '实物藏品', tagType: 'info'},
  },
  // 订单状态(提货订单)
  orderTypeMap_pickup: {
    1: {tagText: '待付款', tagType: 'info'},
    3: {tagText: '取消', tagType: 'danger'},
    4: {tagText: '已完成', tagType: 'success'},
    7: {tagText: '待发货', tagType: 'info'},
    8: {tagText: '待收货', tagType: 'primary'}
  },
  // 支付方法
  paymentMethod: {
    1: {tagText: '银行卡', tagType: 'warning'},
    2: {tagText: '支付宝', tagType: 'primary'},
    3: {tagText: '微信', tagType: 'success'}
  },
  // 是否强制更新
  isMandatory: {
    1: {tagText: '是', tagType: 'success'},
    0: {tagText: '否', tagType: 'danger'}
  },
  // 设备类型
  deviceType: {
    0: {tagText: 'IOS', tagType: 'warning'},
    1: {tagText: '安卓', tagType: 'primary'}
  },
  thirdPartyAuditStatus: {
    1: {tagText: '未审核', tagType: 'info'},
    2: {tagText: '审核中', tagType: 'primary'},
    3: {tagText: '审核通过', tagType: 'success'},
    4: {tagText: '审核失败', tagType: 'danger'},
  }
}