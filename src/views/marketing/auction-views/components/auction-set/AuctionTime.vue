<template>
  <div class="table_card">
    <div class="page_title">竞拍时间</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="订单支付超时时间" prop="auctionOrderTimeout">
            <gb-input-number 
              limit-type="integer"
              v-model="formData.auctionOrderTimeout" placeholder="请输入订单支付超时时间" unit="分" />
          </el-form-item>
          <el-form-item label="出价倒计时" prop="auctionBidCountdown">
            <gb-input-number 
              limit-type="integer"
              v-model="formData.auctionBidCountdown" placeholder="请输入出价倒计时" unit="分" />
          </el-form-item>
        </el-form>

        <div>
          <el-button type="primary"
            v-if="!isEdit" 
            :disabled="editDisabled" @click="isEdit = true">立即编辑</el-button>
          <template v-else>
            <el-button type="danger" @click="revoke">撤销</el-button>
            <el-button type="primary" :loading="loading_submit" @click="_setData">确认修改</el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

export default {
  name: 'AuctionTime',
  
  props: {
    // 表单数据
    formData: {
      type: Object,
      required: true
    },
    // 禁用编辑
    editDisabled: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      isEdit: false,
      loading_submit: false,
      
      rules: {
        auctionOrderTimeout: [{required: true, message: '订单支付超时时间手续费不能为空', trigger: 'blur'}],
        auctionBidCountdown: [{required: true, message: '出价倒计时手续费不能为空', trigger: 'blur'}]
      }
    }
  },

  watch: {
    formData(val) {
      this.setDataCache();
    }
  },

  methods: {
    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_auctionTime({
              auctionOrderTimeout: precisionCalc.mul(this.formData.auctionOrderTimeout || 0, 60),
              auctionBidCountdown: precisionCalc.mul(this.formData.auctionBidCountdown || 0, 60)
            });
            this.$message.success('修改成功！');
            this.setDataCache();
            this.isEdit = false;
          }catch(e) {
            this.$emit('update:formData', { ...this.formData_cache });
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }
      })
    },
    /**数据缓存，用于撤销操作*/
    setDataCache() {
      this.formData_cache = { ...this.formData };
    },
    /**撤销*/
    revoke() {
      this.$refs['formRef'].clearValidate();
      
      this.$emit('update:formData', { ...this.formData_cache }); 
      this.isEdit = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>