<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="700px"
  >
    <el-form
      v-loading="loading_data"

      ref="dialogFormRef" style="padding: 0 20px"
      :model="detailInfo" :rules="rules"
      label-position="left" label-width="110px"
    >
      <MultiLangForm ref="multiLangFormRef" :detail-info="detailInfo" />
      <el-form-item label="发行方logo" prop="logo">
        <uploader-single-file 
          :file-url.sync="detailInfo.logo"
          @verify="$refs['dialogFormRef'].validateField('logo')"
          :uploadAreaSize="{width: '150px', height: '150px'}"
          ratio='130*130px' />
      </el-form-item>
      <el-form-item label="发行方比例" prop="feeRatio">
        <gb-input-number v-model="detailInfo.feeRatio" unit="%" />
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <gb-input-number limit-type="integer" v-model="detailInfo.weight" />
        <div class="form_control_tip">权重越大，排序越前</div>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading" :disabled="loading_data"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryDataConvert, addPlaceholderData } from '@/utils/lang-data-hanlde'
import precisionCalc from '@/utils/precision-calc'

import { CreaterSelect } from '@/components/business'
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import MultiLangForm from './MultiLangForm'

export default {
  name: 'IssuerAddOrEditDialog',
  components: { CreaterSelect, UploaderSingleFile, MultiLangForm },

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框类型
    dialogType: {
      type: String,
      required: true
    },
      // 对话框主题
      dialogTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    // 编辑id
    editId: {
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      rules: {
        logo: [{required: true, message: '发行方logo不能为空', trigger: 'blur'}],
        feeRatio: [{required: true, message: '发行方比例不能为空', trigger: 'blur'}],
        weight: [{required: true, message: '权重不能为空', trigger: 'blur'}]
      },
      // 详情
      loading_data: false,
      detailInfo: {
        distributionCompanyLangPOList_convert: addPlaceholderData({
          name: '',
          description: ''
        })
      }
    }
  },
  computed: {
    // 双向数据绑定dialogVisible
    syncedDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      }
    },
    // 双向数据绑定submitLoading
    syncedSubmitLoading: {
      get() {
        return this.submitLoading;
      },
      set(newVal) {
        this.$emit('update:submitLoading', newVal);
      }
    }
  },
  
  watch: {
    dialogVisible(val) {
      if(val) {
        if(this.dialogType == 'add') {
          this.detailInfo = {
            distributionCompanyLangPOList_convert: addPlaceholderData({
              name: '',
              description: ''
            })
          }
        }else {
          this.get_detailInfo();
        }
      }
    }
  },

  methods: {
    // 获取详情
    async get_detailInfo() {
      this.loading_data = true;
      try{
        let res = await this.$api.get_issuer_detailInfo(this.editId);
        this.detailInfo = {
          ...(res.data || {}),
          feeRatio: precisionCalc.mul(res.data.feeRatio || 0, 100),// 小数 => 百分比
          distributionCompanyLangPOList_convert: queryDataConvert(res.data.distributionCompanyLangPOList || []),
          distributionCompanyLangPOList: undefined
        }
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    },
    // 提交
    async handleSubmit() {
      // 校验多语言表单
      let flag = await this.$refs['multiLangFormRef'].formValidate();
      if(!flag) { return };

      this.$refs.dialogFormRef.validate(valid => {
        if(valid) {
          this.syncedSubmitLoading = true;
          this.$emit('submit');
        }else {
          return false;
        }
      })
    },
    // 关闭对话框
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();

      this.syncedDialogVisible = false;
    }
  }
}
</script>

<style lang="scss">

</style>