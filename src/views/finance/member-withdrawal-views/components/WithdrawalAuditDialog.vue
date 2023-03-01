<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="700px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="95px"
    > 
      <el-form-item label="审核" prop="auditState">
        <el-radio-group v-model="rowData.auditState">
          <el-radio
            v-for="(item, index) in options_audit" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 已拒绝显示 -->
      <el-form-item v-if="rowData.auditState == 3" label="拒绝理由" prop="refuseReasons">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入拒绝理由"
          v-model="rowData.refuseReasons" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="loading_submit"
        type="primary" @click="_handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { companyAuditMap, generateOptionsByMap } from '@/config'

export default {
  name: 'WithdrawalAuditDialog',

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框标题
    dialogTitle: {
      type: String,
      default: '[ 标题 ]'
    },
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading_submit: false,
      options_audit: generateOptionsByMap(companyAuditMap),
      rules: {
        auditState: [{required: true, message: '审核不能为空', trigger: 'change'}],
        refuseReasons: [{required: true, message: '拒绝理由不能为空', trigger: 'change'}]
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
    }
  },

  methods: {
    /**提交*/
    _handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try{
            await this.$api.audit_one_withdrawalAudit({
              id: this.rowData.id,
              auditStatus: this.rowData.auditState,
              refuseReason: this.rowData.auditState == 3 ? this.rowData.refuseReasons : undefined
            })
            this.$message.success('审核成功！');
            this.syncedDialogVisible = false;
            this.$emit('refresh');
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false;
          }
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