<template>
  <div class="table_card">
    <div class="page_title">快递100</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="顾客配置" prop="customer">
            <el-input v-model="formData.customer" placeholder="请输入顾客配置" clearable />
          </el-form-item>
          <el-form-item label="授权key" prop="key">
            <el-input v-model="formData.key" placeholder="请输入授权key" clearable />
          </el-form-item>
          <el-form-item label="密钥" prop="secret">
            <el-input v-model="formData.secret" placeholder="请输入密钥" clearable />
          </el-form-item>
          <el-form-item label="回调地址" prop="url">
            <el-input v-model="formData.url" placeholder="请输入回调地址" clearable />
          </el-form-item>
          <el-form-item label="用户ID" prop="userid">
            <el-input v-model="formData.userid" placeholder="请输入用户ID" clearable />
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
  name: 'Express100',

  data() {
    return {
      formData: {}, // 表单数据
      editDisabled: false,// 禁用编辑

      isEdit: false,
      loading_submit: false,
      
      rules: {
        customer: [{required: true, message: '顾客配置不能为空', trigger: 'blur'}],
        key: [{required: true, message: '授权key不能为空', trigger: 'blur'}],
        secret: [{required: true, message: '密钥不能为空', trigger: 'blur'}],
        url: [{required: true, message: 'url不能为空', trigger: 'blur'}],
        userid: [{required: true, message: '用户ID不能为空', trigger: 'blur'}],
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
        let res = await this.$api.get_express100();
        this.formData = res.data || {};

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
            await this.$api.set_express100(this.formData);
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