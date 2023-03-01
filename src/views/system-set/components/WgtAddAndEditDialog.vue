<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="700px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="110px"
    > 
      <el-form-item label="上传补丁">
        <el-upload
          ref="uploadRef"
          :action="uploaderUrl"
          :data="{type: 3}"
          :headers="headers"
          accept='.wgt' drag
          multiple :limit="1"

          :before-upload="handlebeforeUpload"
          :on-success="handleUploadSuccess"
          :on-exceed="handleExceed"
          :before-remove="handlebeforeRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item >
      <el-form-item label="版本号" prop="versionNum">
        <el-input v-model="rowData.versionNum" placeholder="请输入版本号" clearable />
      </el-form-item>
      <el-form-item label="APP补丁路径" prop="patchUrl">
        <el-input v-model="rowData.patchUrl" placeholder="请输入APP补丁路径" clearable />
      </el-form-item>
      <el-form-item label="设备" prop="device">
        <el-radio-group v-model="rowData.device">
          <el-radio
            v-for="(item, index) in options_device" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="强制更新" prop="mandatoryUpdate">
        <el-radio-group v-model="rowData.mandatoryUpdate">
          <el-radio
            v-for="(item, index) in options_isMandatory" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入备注"
          v-model="rowData.remark" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deviceTypeMap, isMandatoryMap, generateOptionsByMap } from '@/config'


export default {
  name: 'WgtAddAndEditDialog',

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
    // 对话框表单参数对象
    rowData: {
      type: Object,
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
      options_device: generateOptionsByMap(deviceTypeMap),
      options_isMandatory: generateOptionsByMap(isMandatoryMap),
      rules: {
        versionNum: [{required: true, message: '版本号不能为空', trigger: 'blur'}],
        patchUrl: [{required: true, message: 'APP补丁路径不能为空', trigger: 'blur'}]
      },

      // 上传相关
      uploaderUrl: `${window.__ENV__.VUE_APP_BASE_API}/api/file/file/uploadObjectOSS`,
      headers: {
        'X-Requested-Token': this.$store.getters.token
      },
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
    syncedDialogVisible(val) {
      // 关闭时清空upload数据
      !val && this.$refs['uploadRef'] && this.$refs['uploadRef'].clearFiles();
    }
  },

  methods: {
    // 提交
    handleSubmit() {
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
    },

    /**上传相关*/
    handlebeforeUpload(file) {
      if(!file.name.includes('.wgt')) {
        this.$message.error('请选择补丁包');
        return false;
      }
    },
    handleUploadSuccess(res, file) {
      if (res.code == 200) {
        this.rowData.patchUrl = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('一个版本只能上传一个补丁!');
    },
    handlebeforeRemove(file, fileList) {
      // ps: 当before-upload不通过，同时会调用before-remove，需要直接删除
      if(!file.name.includes('.wgt')) {
        return true;
      }

      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>

<style lang="scss">

</style>