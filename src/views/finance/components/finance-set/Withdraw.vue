<template>
  <div class="table_card">
    <div class="page_title">提现设置</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="会员提现">
            <el-switch
              v-model="formData.withdraw_enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0" />
          </el-form-item>
          <!-- 会员提现打开显示 -->
          <template v-if="formData.withdraw_enable == 1">
            <el-form-item label="单次提现最低金额" prop="withdraw_min_val">
              <gb-input-number v-model="formData.withdraw_min_val" placeholder="请输入单次提现最低金额" unit="元" />
            </el-form-item>
            <el-form-item label="单次提现最高金额" prop="withdraw_max_val">
              <gb-input-number v-model="formData.withdraw_max_val" placeholder="请输入单次提现最高金额" unit="元" />
            </el-form-item>
            <el-form-item label="提现手续费" prop="withdraw_fee">
              <gb-input-number v-model="formData.withdraw_fee" placeholder="请输入提现手续费" unit="%" />
            </el-form-item>
          </template>
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
  name: 'Withdraw',
  
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
        withdraw_min_val: [{required: true, message: '单次提现最低金额不能为空', trigger: 'blur'}],
        withdraw_max_val: [{required: true, message: '单次提现最高金额不能为空', trigger: 'blur'}],
        withdraw_fee: [{required: true, message: '提现手续费不能为空', trigger: 'blur'}]
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
          // 确保单次提现最低金额 小于 单次提现最高金额
          if(this.formData.withdraw_min_val > this.formData.withdraw_max_val) {
            return this.$message.warning('单次提现最低金额不能大于单次提现最高金额!');
          }

          this.loading_submit = true;
          try {
            await this.$api.set_withdraw({
              ...this.formData,
              // 百分比 => 小数
              withdraw_fee: precisionCalc.div(this.formData.withdraw_fee || 0, 100)
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