<template>
  <div class="table_card">
    <div class="page_title">充值设置</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="135px"
          :disabled="!isEdit"
        >
          <el-form-item label="会员充值">
            <el-switch
              v-model="formData.deposit_enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0" />
          </el-form-item>
          <!-- 会员提现打开显示 -->
          <template v-if="formData.deposit_enable == 1">
            <el-form-item label="最小充值数值" prop="deposit_min_val">
              <gb-input-number v-model="formData.deposit_min_val" placeholder="请输入最小充值数值" unit="元" />
            </el-form-item>
            <el-form-item label="最大充值数值" prop="deposit_max_val">
              <gb-input-number v-model="formData.deposit_max_val" placeholder="请输入最大充值数值" unit="元" />
            </el-form-item>

            <el-form-item label="收款方式" prop="deposit_type">
              <el-select v-model="formData.deposit_type" placeholder="请选择收款方式">
                <el-option v-for="item in options_paymentMethod" :key="item.value"
                  :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <!-- 根据收款方式显示对应参数配置 -->
            <template v-if="formData.deposit_type == 1">
              <el-form-item label="收款姓名" prop="bank_account_name">
                <el-input v-model="formData.bank_account_name" placeholder="请输入收款姓名" clearable />
              </el-form-item>
              <el-form-item label="银行账号" prop="bank_account">
                <el-input v-model="formData.bank_account" placeholder="请输入银行账号" clearable />
              </el-form-item>
              <el-form-item label="银行名称" prop="bank_name">
                <el-input v-model="formData.bank_name" placeholder="请输入银行名称" clearable />
              </el-form-item>
              <el-form-item label="支行名称" prop="bank_branch_name">
                <el-input v-model="formData.bank_branch_name" placeholder="请输入支行名称" clearable />
              </el-form-item>
            </template>
            <template v-if="formData.deposit_type == 2">
              <el-form-item label="支付宝收款账号" prop="alipay_account">
                <el-input v-model="formData.alipay_account" placeholder="请输入支付宝收款账号" clearable />
              </el-form-item>
              <el-form-item label="支付宝收款二维码" prop="alipay_account_qrcode">
                <uploader-single-file @verify="verify" :file-url.sync="formData.alipay_account_qrcode" :disabled="!isEdit" />
              </el-form-item>
            </template>
            <template v-else-if="formData.deposit_type == 3">
              <el-form-item label="微信收款账号" prop="wechat_account">
                <el-input v-model="formData.wechat_account" placeholder="请输入微信收款账号" clearable />
              </el-form-item>
              <el-form-item label="微信收款二维码" prop="wechat_account_qrcode">
                <uploader-single-file @verify="verify" :file-url.sync="formData.wechat_account_qrcode" :disabled="!isEdit" ratio="130*130px" />
              </el-form-item>
            </template>
          </template>  
        </el-form>
      </el-col>
    </el-row>

    <div>
      <el-button type="primary"
        v-if="!isEdit" 
        :disabled="editDisabled" @click="isEdit = true">立即编辑</el-button>
      <template v-else>
        <el-button type="danger" @click="revoke">撤销</el-button>
        <el-button type="primary" :loading="loading_submit" @click="_setData">确认修改</el-button>
      </template>
    </div>
    
  </div>
</template>

<script>
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'

import { paymentMethodMap, generateOptionsByMap } from '@/config'

export default {
  name: 'Recharge',
  components: { UploaderSingleFile },

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
      options_paymentMethod: generateOptionsByMap(paymentMethodMap),
      rules: {
        deposit_min_val: [{required: true, message: '最小充值数值不能为空', trigger: 'blur'}],
        deposit_max_val: [{required: true, message: '最大充值数值不能为空', trigger: 'blur'}],
        deposit_type: [{required: true, message: '收款方式不能为空', trigger: 'blur'}],

        wechat_account: [{required: true, message: '微信收款账号不能为空', trigger: 'blur'}],
        wechat_account_qrcode: [{required: true, message: '微信收款二维码不能为空', trigger: 'blur'}],

        alipay_account: [{required: true, message: '支付宝收款账号不能为空', trigger: 'blur'}],
        alipay_account_qrcode: [{required: true, message: '支付宝收款二维码不能为空', trigger: 'blur'}],
        
        bank_account_name: [{required: true, message: '收款姓名不能为空', trigger: 'blur'}],
        bank_account: [{required: true, message: '银行账号不能为空', trigger: 'blur'}],
        bank_name: [{required: true, message: '银行名称不能为空', trigger: 'blur'}],
        bank_branch_name: [{required: true, message: '支行名称不能为空', trigger: 'blur'}],
      }
    }
  },

  watch: {
    formData(val) {
      this.setDataCache();
    }
  },

  methods: {
    verify() {
      console.log('verify');
      this.$refs['formRef'].validate();
    },

    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_recharge(this.formData);
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