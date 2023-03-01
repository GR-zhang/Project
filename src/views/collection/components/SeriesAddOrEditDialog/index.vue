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
      label-position="left" label-width="100px"
    >
      <MultiLangForm ref="multiLangFormRef" :detail-info="detailInfo" />
      <el-form-item label="所属创作者" prop="designerId">
        <CreaterSelect
          :disabled="dialogType == 'edit'"
          v-model="detailInfo.designerId" 
          :tag-name.sync="detailInfo.userName"
          @validate="$refs['dialogFormRef'].validateField('designerId')" />
      </el-form-item>
      <el-form-item label="系列logo" prop="logoUrl">
        <uploader-single-file 
          :file-url.sync="detailInfo.logoUrl"
          @verify="$refs['dialogFormRef'].validateField('logoUrl')"
          :uploadAreaSize="{width: '150px', height: '150px'}"
          ratio='130*130px' />
      </el-form-item>
      <el-form-item label="热门系列" prop="isHot">
        <el-radio-group v-model="detailInfo.isHot">
          <el-radio
            v-for="(item, index) in options_booleanStatus" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
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
import { booleanStatusMap, generateOptionsByMap } from '@/config'
import { queryDataConvert, addPlaceholderData } from '@/utils/lang-data-hanlde'

import { CreaterSelect } from '@/components/business'
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import MultiLangForm from './MultiLangForm'

export default {
  name: 'SeriesAddOrEditDialog',
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
      options_booleanStatus: generateOptionsByMap(booleanStatusMap),
      rules: {
        designerId: [{required: true, message: '所属创作者不能为空', trigger: 'blur'}],
        logoUrl: [{required: true, message: '系列logo不能为空', trigger: 'blur'}]
      },
      // 详情
      loading_data: false,
      detailInfo: {
        seriesLangPOS_convert: addPlaceholderData({
          seriesName: '',
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
            isHot: 2,//热门系列: 否
            seriesLangPOS_convert: addPlaceholderData({
              seriesName: '',
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
        let res = await this.$api.get_series_detailInfo(this.editId);
        this.detailInfo = {
          ...(res.data || {}),
          seriesLangPOS_convert: queryDataConvert(res.data.seriesLangPOS || []),
          seriesLangPOS: undefined
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