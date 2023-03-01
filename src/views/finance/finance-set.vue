<template>
  <div class="finance-set-container">
    <!-- 提现设置 -->
    <withdraw :form-data.sync="withdrawData" :edit-disabled="loading_data" />
    <!-- 充值设置 -->
    <!-- <recharge :form-data.sync="rechargeData" :edit-disabled="loading_data" /> -->
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

import { 
  Withdraw,
  Recharge,
} from './components/finance-set'

export default {
  name: 'FinanceSet',
  components: {
    Withdraw,
    Recharge
  },

  data() {
    return {
      loading_data: false,
      withdrawData: {},
      rechargeData: {}
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取 所有财务设置 数据*/
    async _getData() {
      this.loading_data = true;
      try{
        let { data }  = await this.$api.get_allFinanceSet_data();
        // 提现设置
        this.withdrawData = {
          withdraw_enable: data.withdraw_enable,
          withdraw_min_val: data.withdraw_min_val,
          withdraw_max_val: data.withdraw_max_val,
          // 小数 => 百分比
          withdraw_fee: precisionCalc.mul(data.withdraw_fee || 0, 100)
        };
        // 充值设置
        this.rechargeData = {
          deposit_enable: data.deposit_enable,
          deposit_min_val: data.deposit_min_val,
          deposit_max_val: data.deposit_max_val,
          deposit_type: Number.parseInt(data.deposit_type || undefined),

          // 银行卡
          bank_account_name: data.bank_account_name,
          bank_account: data.bank_account,
          bank_name: data.bank_name,
          bank_branch_name: data.bank_branch_name,
          // 支付宝
          alipay_account: data.alipay_account,
          alipay_account_qrcode: data.alipay_account_qrcode,
          // 微信
          wechat_account: data.wechat_account,
          wechat_account_qrcode: data.wechat_account_qrcode
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