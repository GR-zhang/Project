<template>
  <div class="table_card">
    <div class="page_title">OSS配置</div>
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
            <el-form-item label="OSS桶名" prop="bucketName">
              <el-input v-model="formData.bucketName" placeholder="请输入OSS桶名" clearable />
            </el-form-item>
            <el-form-item label="证书存放路径" prop="certPath">
              <el-input v-model="formData.certPath" placeholder="请输入证书存放路径" clearable />
            </el-form-item>
            <el-form-item label="端点地址" prop="endpoint">
              <el-input v-model="formData.endpoint" placeholder="请输入端点地址" clearable />
            </el-form-item>
            <el-form-item label="图片上传大小限制" prop="fileSize">
              <el-input v-model="formData.fileSize" placeholder="请输入图片上传大小限制" clearable />
            </el-form-item>
            <el-form-item label="接口地址" prop="url">
              <el-input v-model="formData.url" placeholder="请输入接口地址" clearable />
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
            <el-form-item label="OSS桶名" prop="bucket">
              <el-input v-model="formData.bucket" placeholder="请输入OSS桶名" clearable />
            </el-form-item>
            <el-form-item label="端点地址" prop="ossUrl">
              <el-input v-model="formData.ossUrl" placeholder="请输入端点地址" clearable />
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
  [2, '阿里云'],
  [3, '七牛']
])

export default {
  name: 'OssConfig',

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
        bucketName: [{required: true, message: 'OSS桶名不能为空', trigger: 'blur'}],
        // certPath: [{required: true, message: '证书存放路径不能为空', trigger: 'blur'}],
        endpoint: [{required: true, message: '端点地址不能为空', trigger: 'blur'}],
        fileSize: [{required: true, message: '图片上传大小限制不能为空', trigger: 'blur'}],
        url: [{required: true, message: '接口地址不能为空', trigger: 'blur'}],
        // 七牛云
        accessKey: [{required: true, message: 'AK不能为空', trigger: 'blur'}],
        secretKey: [{required: true, message: 'SK不能为空', trigger: 'blur'}],
        bucket: [{required: true, message: 'OSS桶名不能为空', trigger: 'blur'}],
        ossUrl: [{required: true, message: '端点地址不能为空', trigger: 'blur'}],
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
          let res = await this.$api.get_ossType();
          this.formData.type = +res.data;
        }

        let res2 = await this.$api.get_ossConfig(this.formData.type);
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
              this.$api.set_ossType({method: this.formData.type}),
              this.$api.set_ossConfig(this.formData.type, this.formData),
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