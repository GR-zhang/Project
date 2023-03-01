<template>
  <el-dialog
    class="dialog-back"
    :title="dialogTitle" :visible.sync="syncedDialogVisible"
    :close-on-click-modal="false" width="750px" append-to-body
  >
    <!-- 表单 -->
    <gb-form-query
      :queryParams="queryParams"
      :queryFormItems="queryFormItems"
      @search-btn-click="filterQuery"
      @reset-btn-click="resetQuery"
      @text-input-keyup-enter="filterQuery" />
    <!-- 表格 -->
    <gb-table-display
      :table-loading="loading_table"
      :table-columns="tableColumns"
      :table-list="tableList"

      :border="false" stripe
    >
      <template v-slot="{ row }">
        <el-button 
          :type="activeId == row.goodsId ? 'success' : 'info'" size="mini"
          @click="handleSelOne(row)"
        >
          {{ activeId == row.goodsId ? '当前选择' : '选择'}}
        </el-button>
      </template>
    </gb-table-display>
    <gb-pagination
      :page.sync="pageParams.pageNum"
      :limit.sync="pageParams.pageSize"
      :total="total"
      @pagination="_getList();$refs['backtopRef'].scrollToTop()"
      
      :auto-scroll="false" />
    <!-- 返回顶部 -->
    <el-backtop ref="backtopRef" target=".dialog-back"></el-backtop>
  </el-dialog>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'

// 初始化查询参数
const initialQueryParams = {
  goodsId: '',
  colName: '',
  listedStatus: 1,//已下架
  marketType: 1, //一级市场
  frozenState: 1 //未冻结
}

export default {
  name: 'GoodsSelectDialog',
  
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
    // 当前选择ID
    activeId: {
      required: true
    }
  },
  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      queryFormItems: [
        {label: '商品ID', prop: 'goodsId', inputType: 'id-19-bit'},
        {label: '藏品名称', prop: 'colName'}
      ],
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
       tableColumns: [
        {
          type: 'img',
          label: '藏品主图', 
          prop: 'thumb', 
          minWidth: 110
        },
        {label: '商品ID', prop: 'goodsId', minWidth: 140},
        {label: '藏品名称', prop: 'colName', minWidth: 150}
      ],
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
    dialogVisible(val) {
      val && this._getList();
    }
  },

  methods: {
    /**获取会员列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_goods_list({
          data: this.queryParams,
          params: this.pageParams
        })
      })
    },
    filterQuery() {
      this.pageParams.pageNum = 1;
      this._getList();
    },
    resetQuery() {
      this.queryParams = { ...initialQueryParams };
      this.pageParams = { ...sharedPageParams };
      this._getList();
    },

    /**选择一行*/
    handleSelOne(row) {
      this.$emit('sel-one', row);
      this.syncedDialogVisible = false;
    }
  },

  
}
</script>

<style lang="scss" scoped>

</style>