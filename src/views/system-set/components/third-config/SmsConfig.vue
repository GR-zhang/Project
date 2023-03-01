<template>
  <div class="table_card">
    <div class="page_title">短信配置</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="第三方类型">
            <el-select v-model="formData.type" placeholder="请选择" @change="_getData(true)">
              <el-option v-for="item in options_thirdType" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 阿里云 -->
          <template v-if="formData.type == 2">
            <el-form-item label="应用accessKeyId" prop="accessKeyId">
              <el-input v-model="formData.accessKeyId" placeholder="请输入应用accessKeyId" clearable />
            </el-form-item>
            <el-form-item label="应用Secret" prop="accessKeySecret">
              <el-input v-model="formData.accessKeySecret" placeholder="请输入应用Secret" clearable />
            </el-form-item>
            <el-form-item label="短信签名名称" prop="signName">
              <el-input v-model="formData.signName" placeholder="请输入短信签名名称" clearable />
            </el-form-item>
            <el-form-item label="模板CODE" prop="templateCode">
              <el-input v-model="formData.templateCode" placeholder="请输入模板CODE" clearable />
            </el-form-item>
          </template>
          <!-- 七牛云 -->
          <template v-if="formData.type == 3">
            <el-form-item label="AK" prop="accessKey">
              <el-input v-model="formData.accessKey" placeholder="请输入AK" clearable />
            </el-form-item>
            <el-form-item label="SK" prop="secretKey">
              <el-input v-model="formData.secretKey" placeholder="请输入SK" clearable />
            </el-form-item>
            <el-form-item label="验证码短信模板id" prop="verificationTemplateId">
              <el-input v-model="formData.verificationTemplateId" placeholder="请输入验证码短信模板id" clearable />
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
import { generateOptionsByMap } from '@/config'

// 第三方类型
const thirdTypeMap = new Map([
  [0, '测试使用(验证码666666)'],
  [2, '阿里云'],
  [3, '七牛']
])

export default {
  name: 'SmsConfig',

  data() {
    return {
      formData: {}, // 表单数据
      editDisabled: false,// 禁用编辑
      options_thirdType: generateOptionsByMap(thirdTypeMap),

      isEdit: false,
      loading_submit: false,
      
      rules: {
        // 阿里云
        accessKeyId: [{required: true, message: '应用accessKeyId不能为空', trigger: 'blur'}],
        accessKeySecret: [{required: true, message: '应用Secret不能为空', trigger: 'blur'}],
        signName: [{required: true, message: '短信签名名称不能为空', trigger: 'blur'}],
        templateCode: [{required: true, message: '模板CODE不能为空', trigger: 'blur'}],
        // 七牛云
        accessKey: [{required: true, message: 'AK不能为空', trigger: 'blur'}],
        secretKey: [{required: true, message: 'SK不能为空', trigger: 'blur'}],
        verificationTemplateId: [{required: true, message: '验证码短信模板id不能为空', trigger: 'blur'}],
      }
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取参数*/
    async _getData(isSelectToggle) {
      this.editDisabled = true;
      try {
        if(!isSelectToggle) {// 页面加载首次请求调用
          let res = await this.$api.get_smsType();
          this.formData.type = +res.data;
        }

        let res2 = await this.$api.get_smsConfig(this.formData.type);
        this.formData = {
          type: this.formData.type,
          ...(res2.data || {})
        }
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
            let res = await Promise.all([
              this.$api.set_smsType({smsType: this.formData.type}),
              this.$api.set_smsConfig(this.formData),
            ])
            // console.log('res', res);
            this.$message.success('修改成功！');
            this.isEdit = false;
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }
      })
    },
    /**撤销*/
    revoke() {
      this.$refs['formRef'].clearValidate();
      
      this._getData();
      this.isEdit = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>