<template>
  <el-dialog
    class="dialog-back-nested"
    :title="dialogTitle" :visible.sync="syncedDialogVisible"
    :close-on-click-modal="false" width="900px" append-to-body
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData"
      label-position="left" label-width="80px"
    > 
      <el-form-item label="协议标题">
        <span>{{ rowData.title }}</span>
      </el-form-item>
      <el-form-item label="协议内容">
        <div class="rich-text" v-html="rowData.content"></div>
      </el-form-item>
    </el-form>

    <!-- 返回顶部 -->
    <el-backtop target=".dialog-back-nested" />
  </el-dialog>
</template>

<script>
export default {
  name: 'ProtocolViewHistoryDialog',

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
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      
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
.rich-text img {
  width: 100%!important;
}

.rich-text pre {
  white-space:pre-wrap; /* css-3 */
  white-space:-moz-pre-wrap; /* Mozilla, since 1999 */
  white-space:-pre-wrap; /* Opera 4-6 */
  white-space:-o-pre-wrap; /* Opera 7 */
  word-wrap:break-word
}
</style>