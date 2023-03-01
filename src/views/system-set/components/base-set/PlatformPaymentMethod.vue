<template>
  <div class="table_card">
    <div class="page_title">平台收款方式</div>
    
    <el-form 
      ref="formRef"
      :model="formData" :rules="rules"
      label-position="left" label-width="135px"
      :disabled="!isEdit"
    >
      <el-row :gutter="50">
        <el-col :md="24" :lg="12">
          <el-divider content-position="left">微信</el-divider>
          <el-form-item label="微信收款账号" prop="wechat_account">
            <el-input v-model="formData.wechat_account" placeholder="请输入微信收款账号" clearable />
          </el-form-item>
          <el-form-item label="微信收款二维码" prop="wechat_account_qrcode">
            <uploader-single-file @verify="verify" :file-url.sync="formData.wechat_account_qrcode" :disabled="!isEdit" ratio="130*130px" />
          </el-form-item>
        </el-col>

        <el-col :md="24" :lg="12">
          <el-divider content-position="left">支付宝</el-divider>
          <el-form-item label="支付宝收款账号" prop="alipay_account">
            <el-input v-model="formData.alipay_account" placeholder="请输入支付宝收款账号" clearable />
          </el-form-item>
          <el-form-item label="支付宝收款二维码" prop="alipay_account_qrcode">
            <uploader-single-file @verify="verify" :file-url.sync="formData.alipay_account_qrcode" :disabled="!isEdit" ratio="130*130px" />
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="12">
          <el-divider content-position="left">银行卡</el-divider>
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
        </el-col>
      </el-row>
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
    
  </div>
</template>

<script>
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'

export default {
  name: 'PlatformPaymentMethod',
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
      
      rules: {
        // wechat_account: [{required: true, message: '微信收款账号不能为空', trigger: 'blur'}],
        // wechat_account_qrcode: [{required: true, message: '微信收款二维码不能为空', trigger: 'blur'}],

        // alipay_account: [{required: true, message: '支付宝收款账号不能为空', trigger: 'blur'}],
        // alipay_account_qrcode: [{required: true, message: '支付宝收款二维码不能为空', trigger: 'blur'}],
        
        // bank_account_name: [{required: true, message: '收款姓名不能为空', trigger: 'blur'}],
        // bank_account: [{required: true, message: '银行账号不能为空', trigger: 'blur'}],
        // bank_name: [{required: true, message: '银行名称不能为空', trigger: 'blur'}],
        // bank_branch_name: [{required: true, message: '支行名称不能为空', trigger: 'blur'}],
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
            /** 特殊校验表单 */
            let wechat = ['wechat_account', 'wechat_account_qrcode'];
            let alipay = ['alipay_account', 'alipay_account_qrcode'];
            let bank = ['bank_account_name', 'bank_account', 'bank_name', 'bank_branch_name'];
            // 三个收款方式必须存在一种
            let flags = [[], [], []];
            wechat.forEach(key => {
              flags[0].push(!!this.formData[key]);
            })
            alipay.forEach(key => {
              flags[1].push(!!this.formData[key]);
            })
            bank.forEach(key => {
              flags[2].push(!!this.formData[key]);
            })

            if([...flags[0], ...flags[1], ...flags[2]].includes(true)) {
              if(flags[0].includes(true) && flags[0].includes(false)) {
                this.$message.warning('请输入微信收款方式完整信息！');
                return;
              } 
              if(flags[1].includes(true) && flags[1].includes(false)) {
                this.$message.warning('请输入支付宝收款方式完整信息！');
                return;
              } 
              if(flags[2].includes(true) && flags[2].includes(false)) {
                this.$message.warning('请输入银行卡收款方式完整信息！');
                return;
              } 
            }else {
              this.$message.warning('请输入至少一种平台收款方式，同时保证该方式信息完整！');
              return;
            }

            await this.$api.set_platformPaymentMethod(this.formData);
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