<template>
  <div class="table_card">
    <div class="page_title">图片设置</div>
    <el-form 
      ref="formRef"
      :model="formData" :rules="rules"
      label-position="left" label-width="120px"
      
    >
      <el-row>
        <el-col :md="24" :lg="8">
          <el-form-item label="客服二维码" prop="customer_service_qrcode" />
          <uploader-single-file @verify="verify" :file-url.sync="formData.customer_service_qrcode" :disabled="!isEdit" ratio="130*130px" />
        </el-col>
        <el-col :md="24" :lg="8">
          <el-form-item label="用户默认头像" prop="default_avatar" />
          <uploader-single-file @verify="verify" :file-url.sync="formData.default_avatar" :disabled="!isEdit" ratio="130*130px" />
        </el-col>
        <el-col :md="24" :lg="8">
          <el-form-item label="邀请好友背景" prop="invite_bg_pic" />
          <uploader-single-file @verify="verify" :file-url.sync="formData.invite_bg_pic" :disabled="!isEdit" ratio="300*450px" />
        </el-col>
      </el-row>
    </el-form>

    <div style="padding-top: 20px;">
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
  name: 'ImgSet',
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
        customer_service_qrcode: [{required: true, message: '客服二维码不能为空', trigger: 'blur'}],
        default_avatar: [{required: true, message: '用户默认头像不能为空', trigger: 'blur'}],
        invite_bg_pic: [{required: true, message: '邀请好友背景不能为空', trigger: 'blur'}]
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
      this.$refs['formRef'].validate();
    },

    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_imgSet(this.formData);
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