<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="550px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="90px"
    > 
      <el-form-item label="藏品名称">
        <span>{{ rowData.colName }}</span>
      </el-form-item>
      <el-form-item label="销售单价">
        <span>{{ rowData.defaultSalePrice || 0 }}元</span>
      </el-form-item>
      <el-form-item label="已发行数量">
        <span>{{ rowData.issueAmount || 0 }}个</span>
      </el-form-item>
      <el-form-item label="发行数量" prop="publishNum">
        <gb-input-number limit-type="integer" v-model="rowData.publishNum" placeholder="请输入发行数量" unit="个" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="loading_submit"
        type="primary" @click="handleSubmit" size="medium">确定发行</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CollectionPublishDialog',

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框标题
    dialogTitle: {
      type: String,
      required: true
    },
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        publishNum: [{required: true, message: '发行数量不能为空', trigger: 'blur'}]
      },
      loading_submit: false
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
    // 提交
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          try{
            this.loading_submit = true;

            await this.$api.publish_nft({
              colId: this.rowData.colId,
              issueAmount: this.rowData.publishNum
            })
            this.loading_submit = false;
            this.$message.success('发行成功!');
            this.syncedDialogVisible = false;
            this.$emit('refresh');
          }catch(e) {
            this.loading_submit = false;
            throw e;
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