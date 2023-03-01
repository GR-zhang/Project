<template>
  <el-dialog
    :close-on-click-modal="true"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="700px"
  >
    <div style="min-height: 300px;">
      {{ reason }}
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'RefuseReasonDialog',

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
    // 理由
    reason: {
      required: true
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
  }
}
</script>

<style lang="scss">

</style>