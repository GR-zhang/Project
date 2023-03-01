<template>
  <div class="table_card">
    <div class="page_title">汇付支付</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="API KEY" prop="apiKey">
            <el-input v-model="formData.apiKey" placeholder="请输入API KEY" clearable />
          </el-form-item>
          <el-form-item label="支付渠道提供的应用ID" prop="appId">
            <el-input v-model="formData.appId" placeholder="请输入支付渠道提供的应用ID" clearable />
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="formData.description" placeholder="请输入说明" clearable />
          </el-form-item>
          <el-form-item label="商户前缀标识" prop="merchPrefix">
            <el-input v-model="formData.merchPrefix" placeholder="请输入商户前缀标识" clearable />
          </el-form-item>
          <el-form-item label="支付方式状态">
            <el-switch
              v-model="formData.paymentStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2" />
          </el-form-item>
          <el-form-item label="私钥" prop="privKey">
            <el-input v-model="formData.privKey" placeholder="请输入私钥" clearable />
          </el-form-item>
          <el-form-item label="公钥" prop="pubKey">
            <el-input v-model="formData.pubKey" placeholder="请输入公钥" clearable />
          </el-form-item>
          <el-form-item label="异步回调通知地址" prop="notifyUrl">
            <el-input v-model="formData.notifyUrl" placeholder="请输入异步回调通知地址" clearable />
          </el-form-item>
          <el-form-item label="退款回调通知地址" prop="refundNotifyUrl">
            <el-input v-model="formData.refundNotifyUrl" placeholder="请输入退款回调通知地址" clearable />
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
export default {
  name: 'hfpaySet',

  data() {
    return {
      formData: {}, // 表单数据
      editDisabled: false,// 禁用编辑

      isEdit: false,
      loading_submit: false,
      
      rules: {
        apiKey: [{required: true, message: 'API KEY不能为空', trigger: 'blur'}],
        appId: [{required: true, message: '支付渠道提供的应用ID不能为空', trigger: 'blur'}],
        description: [{required: true, message: '说明不能为空', trigger: 'blur'}],
        merchPrefix: [{required: true, message: '商户前缀标识不能为空', trigger: 'blur'}],
        privKey: [{required: true, message: '私钥不能为空', trigger: 'blur'}],
        pubKey: [{required: true, message: '公钥不能为空', trigger: 'blur'}],
        notifyUrl: [{required: true, message: '异步回调通知地址不能为空', trigger: 'blur'}],
        refundNotifyUrl: [{required: true, message: '退款回调通知地址不能为空', trigger: 'blur'}],
      }
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取参数*/
    async _getData() {
      this.editDisabled = true;
      try {
        let res = await this.$api.get_hfpaySet();
        let configData = res.data || {};
        this.formData = {
          ...configData,
          paymentStatus: configData.paymentStatus || 2
        }

        await this.$nextTick();
        this.setDataCache();
      }catch(e) {
        throw e;
      }finally {
        this.editDisabled = false;
      }
    },
    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_hfpaySet({ ...this.formData, id: this.formData.id || undefined});
            this.$message.success('修改成功！');
            this.setDataCache();
            this.isEdit = false;
          }catch(e) {
            this.formData = { ...this.formData_cache };
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
      
      this.formData = { ...this.formData_cache };
      this.isEdit = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>