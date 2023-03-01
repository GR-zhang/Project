<template>
  <div class="table_card">
    <div class="page_title">实名认证配置</div>
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
          <!-- 百度云 -->
          <template v-if="formData.type == 1">
            <el-form-item label="获取token地址" prop="authHost">
              <el-input v-model="formData.authHost" placeholder="请输入获取token地址" clearable />
            </el-form-item>
            <el-form-item label="百度云应用的AK" prop="idcardApiKey">
              <el-input v-model="formData.idcardApiKey" placeholder="请输入百度云应用的AK" clearable />
            </el-form-item>
            <el-form-item label="百度云应用的SK" prop="idcardSecretKey">
              <el-input v-model="formData.idcardSecretKey" placeholder="请输入百度云应用的SK" clearable />
            </el-form-item>
            <el-form-item label="身份认证url" prop="identityAuthHost">
              <el-input v-model="formData.identityAuthHost" placeholder="请输入身份认证url" clearable />
            </el-form-item>
          </template>
          <!-- 七牛云 -->
          <template v-if="formData.type == 3">
            <el-form-item label="AK" prop="accessKey">
              <el-input v-model="formData.accessKey" placeholder="请输入AK" clearable />
            </el-form-item>
            <el-form-item label="身份认证url" prop="qiNinAuthAddr">
              <el-input v-model="formData.qiNinAuthAddr" placeholder="请输入身份认证url" clearable />
            </el-form-item>
            <el-form-item label="SK" prop="secretKey">
              <el-input v-model="formData.secretKey" placeholder="请输入SK" clearable />
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
  // [0, '不对接第三方（测试使用）'],
  [1, '百度'],
  // [2, '阿里云(暂未实现)'],
  [3, '七牛']
])

export default {
  name: 'RealNameConfig',

  data() {
    return {
      formData: {}, // 表单数据
      editDisabled: false,// 禁用编辑
      options_thirdType: generateOptionsByMap(thirdTypeMap),

      isEdit: false,
      loading_submit: false,
      
      rules: {
        // 百度云
        authHost: [{required: true, message: '获取token地址不能为空', trigger: 'blur'}],
        idcardApiKey: [{required: true, message: '百度云应用的AK不能为空', trigger: 'blur'}],
        idcardSecretKey: [{required: true, message: '百度云应用的SK不能为空', trigger: 'blur'}],
        identityAuthHost: [{required: true, message: '身份认证url不能为空', trigger: 'blur'}],
        // 七牛云
        accessKey: [{required: true, message: 'AK不能为空', trigger: 'blur'}],
        qiNinAuthAddr: [{required: true, message: '身份认证url不能为空', trigger: 'blur'}],
        secretKey: [{required: true, message: 'SK不能为空', trigger: 'blur'}],
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
          let res = await this.$api.get_realNameType();
          this.formData.type = +res.data;
        }

        let res2 = await this.$api.get_realNameConfig(this.formData.type);
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
              this.$api.set_realNameType({authType: this.formData.type}),
              this.$api.set_realNameConfig(this.formData),
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