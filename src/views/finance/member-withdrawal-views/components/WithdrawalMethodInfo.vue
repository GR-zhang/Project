<template>
  <div class="WithdrawalMethodInfo">
    <div v-if="row.method == 1">
      <div>银行卡号：{{ row.account }}</div>
      <div>银行名称：{{ row.bankName }}</div>
    </div>
    <div v-else-if="row.method == 2">支付宝账号：{{ row.account }}</div>
    <div v-else-if="row.method == 3">
      <el-image
        :style="{width: '45px', height: '45px'}"
        :src="row.account"
        fit="contain"
        :preview-src-list="[row.account]"
      >
        <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
          <i class="el-icon-picture-outline" style="font-size: 30px;" />
        </div>
      </el-image>
      <br/>微信收款码
    </div>
  </div>
</template>

<script>
export default {
  name: 'WithdrawalMethodInfo',

  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>