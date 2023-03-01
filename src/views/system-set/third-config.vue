<template>
  <div class="third-config-container">
    <!-- 链配置 -->
    <ChainSet />
    <!-- 汇付支付 -->
    <HfpaySet />
    <!-- 快递100 -->
    <Express100 />
    <!-- 微信小程序 -->
    <WxMinipro />
    <!-- 实名认证配置 -->
    <RealNameConfig />
    <!-- 短信配置 -->
    <SmsConfig />
     <!-- OSS配置 -->
    <OssConfig />
  </div>
</template>

<script>
import {
  ChainSet,
  HfpaySet,
  Express100,
  WxMinipro,
  RealNameConfig,
  SmsConfig,
  OssConfig,
} from './components/third-config'

export default {
  name: 'ThirdConfig',
  components: {
    ChainSet,
    HfpaySet,
    Express100,
    WxMinipro,
    RealNameConfig,
    SmsConfig,
    OssConfig,
  }
}
</script>

<style lang="scss" scoped>

</style>