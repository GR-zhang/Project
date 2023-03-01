<template>
  <el-dialog
    class="dialog-back"
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="850px"
  >
    <el-form      
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData"
      label-position="left" label-width="85px"
    > 
      <el-form-item label="TokenID"><span>{{ rowData.tokenId }}</span></el-form-item>
      <el-form-item label="藏品ID"><span>{{ rowData.colId }}</span></el-form-item>
      <el-form-item label="藏品名称"><span>{{ rowData.colName }}</span></el-form-item>
      <el-form-item label="所属创作者"><span>{{ rowData.itemCreator }}</span></el-form-item>
      <el-form-item label="藏品版号"><span>{{ rowData.itemSn }}</span></el-form-item>
      <el-form-item label="藏品主图">
        <el-image 
          style="width: 100px; height: 100px"
          :src="rowData.picture" fit="cover" 
          :preview-src-list="[rowData.picture]" />
      </el-form-item>
      <el-form-item label="流转记录">
        <gb-table-display
          :table-loading="loading_table"
          :table-columns="tableColumns"
          :table-list="tableList"
        
          :has-operation-column="false" />
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList();$refs['backtopRef'].scrollToTop()" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="syncedDialogVisible = false" size="medium">关闭</el-button>
    </span>

    <!-- 返回顶部 -->
    <el-backtop ref="backtopRef" target=".dialog-back"></el-backtop>
  </el-dialog>
</template>

<script>
import { sharedPageParams } from '@/mixins'

export default {
  name: 'NftFlowRecordDialog',

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
      required: true
    },
  },
  data() {
    return {
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '来源', prop: 'fromAddr', minWidth: 130},
        {label: '去向', prop: 'toAddr', minWidth: 130},
        {label: '流转价格', prop: 'price', minWidth: 100},
        {
          type: 'timestamp',
          label: '划转时间',
          prop: 'createTime',
          width: 140
        }
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
    rowData(val) {
      // 重置参数和返回顶部
      this.pageParams = { ...sharedPageParams };
      try{
        this.$refs['backtopRef'].scrollToTop();
      }catch(e) {}

      this._getList();
    }
  },

  methods: {
    /**获取流转记录列表*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_nftFlowRecord_list({
          goodsId: this.rowData.goodsId,
          ...this.pageParams
        });
        this.tableList = res.data.rows || [];
        this.total = Number.parseInt(res.data.total);
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