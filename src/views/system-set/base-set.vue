<template>
  <div class="base-set-container">
    <!-- 创作者燃料费 -->
    <create-fuel :form-data.sync="creatorFuelData" :edit-disabled="loading_data" />
    <!-- 交易功能 -->
    <transaction-func :form-data.sync="transactionFuncData" :edit-disabled="loading_data" />
    <!-- 图片设置 -->
    <img-set :form-data.sync="imgSetData" :edit-disabled="loading_data" />
    <!-- 钱包地址 -->
    <wallet-address :form-data.sync="walletAddressData" :edit-disabled="loading_data" />
    <!-- 下载 -->
    <download-address :form-data.sync="downloadAddressData" :edit-disabled="loading_data" />
    <!-- 平台收款方式 -->
    <platform-payment-method :form-data.sync="platformPaymentMethodData" :edit-disabled="loading_data" />

    <!-- 返回顶部 -->
    <gb-back-top />
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

import { GbBackTop } from '@/components/global'
import { 
  CreateFuel,
  TransactionFunc,
  WalletAddress,
  DownloadAddress,
  ImgSet,
  PlatformPaymentMethod
} from './components/base-set'

export default {
  name: 'BaseSet',
  components: {
    CreateFuel,
    TransactionFunc,
    WalletAddress,
    DownloadAddress,
    ImgSet,
    PlatformPaymentMethod,
    
    GbBackTop
  },

  data() {
    return {
      loading_data: false,
      creatorFuelData: {},
      transactionFuncData: {},
      imgSetData: {},
      walletAddressData: {},
      downloadAddressData:{},
      platformPaymentMethodData: {},
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取 所有基础设置 数据*/
    async _getData() {
      this.loading_data = true;
      try{
        let { data }  = await this.$api.get_allBaseSet_data();
        // 创作者燃料费
        this.creatorFuelData = {
          personal_designer: data.personal_designer,
          team_designer: data.team_designer
        };
        // 交易功能
        this.transactionFuncData = {
          second_market_enable: data.second_market_enable,
          second_market_permit: (data.second_market_permit.split(',') || []).map(item => Number.parseInt(item)),
          second_market_intervals: data.second_market_intervals,
          max_markup_per_time : precisionCalc.mul(data.max_markup_per_time || 0, 100),
          max_markup_all: precisionCalc.mul(data.max_markup_all || 0, 100),

          donate_enable: data.donate_enable,
          donate_fee: precisionCalc.mul(data.donate_fee || 0, 100),
          donate_min_fee: data.donate_min_fee,
          auto_audit_day: data.auto_audit_day
        };
        // 图片设置
        this.imgSetData = {
          customer_service_qrcode: data.customer_service_qrcode,
          default_avatar: data.default_avatar,
          invite_bg_pic: data.invite_bg_pic
        };
        // 钱包地址
        this.walletAddressData = {
          gas_address: data.gas_address,
          gas_address_key: data.gas_address_key,
          mint_address: data.mint_address,
          mint_address_key: data.mint_address_key
        };
        // 下载地址
        this.downloadAddressData = {
          android_url: data.android_url,
          ios_url: data.ios_url
        };
        // 平台收款方式
        this.platformPaymentMethodData = {
          wechat_account: data.wechat_account,
          wechat_account_qrcode: data.wechat_account_qrcode,
          alipay_account: data.alipay_account,
          alipay_account_qrcode: data.alipay_account_qrcode,
          bank_account_name: data.bank_account_name,
          bank_account: data.bank_account,
          bank_name: data.bank_name,
          bank_branch_name: data.bank_branch_name
        };
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>