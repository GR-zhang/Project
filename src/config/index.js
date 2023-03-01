// multi-tag-info
export { default as multiTagInfo } from './multi-tag-info'

//============工具函数============
/** 根据map对象生成控件所需options数据
 * @param {Object} map map对象
 * @return {Array} options数组
*/
export const generateOptionsByMap = (map) => {
  let finnalOptions = [];

  for(let [key, value] of map.entries()) {
    let optionsItem = {label: value, value: key};
    finnalOptions.push(optionsItem);
  }

  return finnalOptions;
}


// 开关状态
export const switchStatusMap = new Map([
  [1, '开启'],
  [2, '关闭']
])
// 布尔状态(1: 是, 2: 否)
export const booleanStatusMap = new Map([
  [1, '是'],
  [2, '否']
])

// 藏品类型
export const collectionTypeMap = new Map([
  [1, '虚拟藏品'],
  [2, '实物藏品']
])
// 藏品性质
export const collectionNatureMap = new Map([
  [1, '版权品'],
  [2, '衍生品']
])
// 上架状态
export const publishStatusMap = new Map([
  [1, '未上架'],
  [2, '上架中'],
  [3, '已上架'],
  [4, '已下架'],
  [5, '售馨']
])
// 运费类型
export const shippingTypeMap = new Map([
  [1, '包邮'],
  [2, '固定运费'],
  [3, '运费模板'],
])

// 计费方式
export const billingMethodMap = new Map([
  [1, '按件数'],
  [2, '按重量']
])


// 用户状态
export const userStatusMap = new Map([
  [1, '开启'],
  [2, '关闭']
])
// 充值类型
export const rechargeTypeMap = new Map([
  [1, '增加'],
  [2, '减少']
])

// 企业申请状态
export const companyApplyStatusMap = new Map([
  [1, '审核中'],
  [2, '已通过'],
  [3, '已拒绝']
])
// 企业审核
export const companyAuditMap = new Map([
  [2, '通过'],
  [3, '拒绝']
])

// 藏品审核状态
export const collectionAuditStatusMap = new Map([
  [3, '审核中'],
  [1, '已通过'],
  [2, '已拒绝']
])
// 藏品审核
export const collectionAuditMap = new Map([
  [1, '通过'],
  [2, '拒绝']
])

// 商品冻结状态
export const goodsFrozenStatusMap = new Map([
  [1, '未冻结'],
  [2, '已冻结'],
  [3, '封禁'],
  [4, '盲盒锁定'],
  [5, '空投锁定'],
  [6, '抢购锁定'],
  [7, '合成锁定'],
  [8, '竞拍锁定']
])
// 商品状态
export const goodsStatusMap = new Map([
  [2, '已上架'],
  [1, '已下架'],
])
// 商品审核
export const goodsAuditMap = new Map([
  [2, '上架'],
  [1, '下架']
])
// 市场类型
export const marketTypeMap = new Map([
  [1, '首发'],
  [2, '寄售']
])

// 创作者类型
export const creatorTypeMap = new Map([
  [1, '个人认证'],
  [2, '企业认证']
])
// 是否推荐创作者
export const isRecomCreatorMap = new Map([
  [1, '是'],
  [2, '否']
])

// 空投方式
export const airdropMethodMap = new Map([
  [1, '全部'],
  [2, '会员等级'],
  [3, '白名单']
])

// 支付类型
export const paymentTypeMap = new Map([
  [1, '余额'],
  [2, '线下支付'],
  [10, '微信'],
  [11, '支付宝'],
  [12, '汇付']
])
// 铸造审核状态
export const castingAuditStatusMap = new Map([
  [1, '未审核'],
  [2, '审核中'],
  [3, '已通过'],
  [4, '已拒绝']
])

// 藏品订单类型
export const collectionOrderTypeMap = new Map([
  [1, '普通藏品'],
  [2, '盲盒']
])
// 藏品订单状态
export const collectionOrderStatusMap = new Map([
  [1, '待付款'],
  [2, '已完成'],
  [3, '已取消']
])

// 转增状态
export const giveawayStatusMap = new Map([
  [1, '待付款'],
  [2, '转赠中'],
  [3, '转赠成功'],
  [4, '转赠失败'],
  [5, '取消订单']
])

// 优先购条件
export const buyFirstConditionMap = new Map([
  [1, '会员等级'],
  [2, '白名单']
])

// 预售类型
export const presaleTypeMap = new Map([
  [1, '普通藏品'],
  [2, '盲盒藏品']
])

// 支付类型(提货订单) 
export const paymentTypeMap_pickup = new Map([
  [1, '余额'],
  [2, '线下支付'],
  [10, '微信'],
  [11, '支付宝'],
  [21, '汇付-支付宝'],
  [22, '汇付-微信'],
  [23, '汇付-快捷支付'],
  [31, '杉德-支付宝'],
  [32, '杉德-微信'],
  [33, '杉德-快捷支付']
])
// 订单状态(提货订单) 
export const orderTypeMap_pickup = new Map([
  [1, '待付款'],
  [3, '取消'],
  [4, '已完成'],
  [7, '待发货'],
  [8, '待收货']
])
// 售后类型(提货订单) 
export const afterSaleTypeMap = new Map([
  [1, '换货'],
  [2, '退货']
])

// 奖金类型
export const bonusTypeMap = new Map([
  [1, '推荐奖'],
  [2, '创作者版税佣金']
])

// 发起方类型
export const initiatorTypeMap = new Map([
  [1, '平台发起'],
  [2, '用户发起']
])
// 竞拍类型
export const auctionTypeMap = new Map([
  [1, '英式竞拍'],
  [2, '荷兰式竞拍']
])
// 保证金状态
export const marginStatusMap = new Map([
  [1, '待开始'],
  [2, '进行中'],
  [3, '已结束']
])
// 竞拍状态
export const initiatorStatusMap = new Map([
  [1, '未开始'],
  [2, '竞拍中'],
  [3, '竞拍结束']
])

// 保证金状态_2
export const marginStatusMap_2 = new Map([
  [1, '未缴纳'],
  [2, '已缴纳'],
  [3, '已退回'],
  [4, '已抵扣'],
  [5, '已罚没']
])

// 物流状态(提货订单)
export const deliveryStatusMap = new Map([
  [0, '在途'],
  [1, '揽收'],
  [2, '疑难'],
  [3, '签收'],
  [4, '退签'],
  [5, '派件'],
  [6, '退回'],
  [7, '转投'],
  [8, '清关'],
  [14, '拒签']
])

// 账户明细变动类型
export const accountDetailChangeTypeMap = new Map([
  [1, '推荐奖'],
  [2, '创作者版税佣金'],
  [3, '提现'],
  [4, '铸造藏品'],
  [5, '管理员操作'],
  [6, '藏品买入支出'],
  [7, '竞拍保证金罚没收入'],
  [8, '竞拍保证金缴纳'],
  [9, '藏品卖出收入'],
  [10, '充值']
])

// 收款方式
export const paymentMethodMap = new Map([
  [1, '银行卡'],
  [2, '支付宝'],
  [3, '微信']
])

// 日志类型_用户
export const logTypeMap_user = new Map([
  [1, '注册'],
  [2, '登录'],
  [3, '修改用户信息'],
  [4, '其他']
])
// 日志类型_创作者
export const logTypeMap_creator = new Map([
  [1, '入驻'],
  [2, '修改设计师信息'],
  [3, '创建藏品']
])

// 设备类型
export const deviceTypeMap = new Map([
  [1, 'Android'],
  [0, 'IOS']
])
// 是否强制更新
export const isMandatoryMap = new Map([
  [1, '是'],
  [0, '否']
])

// 轮播图跳转类型
export const swiperJumpTypeMap = new Map([
  [1, '跳转商品'],
  [2, '跳转链接'],
  [3, '不跳转']
])