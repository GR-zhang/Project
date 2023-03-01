<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="800px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData"
      label-position="left" label-width="100px"
    > 
      <el-form-item label="合成用户昵称">{{  rowData.nickName }}</el-form-item>
      <el-form-item label="合成标题">{{ rowData.activityName }}</el-form-item>
      <el-form-item label="合成目标主图">
        <el-image 
          style="width: 100px; height: 100px"
          :src="rowData.activityImage" fit="cover" 
          :preview-src-list="[rowData.activityImage]" />
      </el-form-item>
      <el-form-item label="合成份数">{{ rowData.num }}</el-form-item>
      <el-form-item label="合成时间">{{ rowData.createTime * 1000 | parseTime }}</el-form-item>
      <el-form-item label="初始合成款式">
        <gb-table-display
          :table-loading="loading_table"
          :table-columns="tableColumns"
          :table-list="tableList"
          :has-operation-column="false" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="syncedDialogVisible = false" size="medium">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SynthesisRecordDetailDialog',

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
      // 表格
      loading_table: false,
      tableList: [],
      tableColumns: [
        {label: '藏品名称', prop: 'colName', minWidth: 150},
        {
          type: 'img',
          label: '藏品主图',
          prop: 'picture',
          minWidth: 110
        },
        {label: '合成所需数量', prop: 'num', minWidth: 110},
      ]
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

  watch: {
    'rowData.recordId'(val) {
      this._getList();
    }
  },

  methods: {
    // 获取 初始合成款式 列表
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_systhesisRecord_detailInfo(this.rowData.recordId);
        this.tableList = res.data.collectionVOS || [];
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    }
  }
}
</script>

<style lang="scss">

</style>