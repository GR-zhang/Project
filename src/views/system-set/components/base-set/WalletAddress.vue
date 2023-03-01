<template>
  <div class="table_card">
    <div class="page_title">钱包地址</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="120px"
          :disabled="!isEdit"
        >
          <el-form-item label="邮费地址" prop="gas_address">
            <el-input 
              type="password" show-password 
              v-model="formData.gas_address" placeholder="请输入邮费地址" clearable />
          </el-form-item>
          <el-form-item label="邮费密钥" prop="gas_address_key">
            <el-input
              type="password" show-password
              v-model="formData.gas_address_key" placeholder="请输入邮费密钥" clearable />
          </el-form-item>
          <el-form-item label="铸造邮费地址" prop="mint_address">
            <el-input
              type="password" show-password
              v-model="formData.mint_address" placeholder="请输入铸造邮费地址" clearable />
          </el-form-item>
          <el-form-item label="铸造邮费私钥" prop="mint_address_key">
            <el-input
              type="password" show-password
              v-model="formData.mint_address_key" placeholder="请输入铸造邮费私钥" clearable />
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
  name: 'WalletAddress',
  
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
        gas_address: [{required: true, message: '邮费地址不能为空', trigger: 'blur'}],
        gas_address_key: [{required: true, message: '邮费密钥不能为空', trigger: 'blur'}],
        mint_address: [{required: true, message: '铸造邮费地址不能为空', trigger: 'blur'}],
        mint_address_key: [{required: true, message: '铸造邮费私钥不能为空', trigger: 'blur'}]
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
            await this.$api.set_walletAddress(this.formData);
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