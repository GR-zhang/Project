<template>
  <el-dialog
    class="dialog-back"
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="750px"
  >
    <!-- 表格 -->
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
    <!-- 返回顶部 -->
    <el-backtop ref="backtopRef" target=".dialog-back"></el-backtop>
  </el-dialog>
</template>

<script>
import { sharedPageParams } from '@/mixins'

export default {
  name: 'GoodsListDialog',

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
    // id
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品版号', prop: 'itemSn', minWidth: 150},
        {label: '藏品价格', prop: 'salePrice', minWidth: 150},
        {label: '当前所属者', prop: 'ownerName', minWidth: 150}
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
    async id(val) {
      this._getList();
    }
  },

  methods: {
    /**获取商品列表*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.view_collection_list({
          colId: this.id,
          ...this.pageParams,
        })
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