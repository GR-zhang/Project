<template>
  <el-drawer
    :title="title"
    :visible.sync="syncedVisible"

    size="40%" :wrapper-closable="false" append-to-body
  >
    <div style="padding: 0 20px;">
      <div class="backtop2 content-scroll">
        <!-- 表单 -->
        <gb-form-query
          :queryParams="queryParams"
          :queryFormItems="queryFormItems"
          @search-btn-click="filterQuery"
          @reset-btn-click="resetQuery"
          @text-input-keyup-enter="filterQuery" />
        <!-- 表格 -->
        <el-table
          :data="tableList" v-loading="loading_table"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}" stripe
          @row-click="handleRowClick"
        >
          <el-table-column label="藏品主图" min-width="70">
            <template v-slot="{ row }">
              <el-image :src="row.thumb" style="width: 45px;height:45px;" fit="containe" :preview-src-list="[row.thumb]" />
            </template>
          </el-table-column>
          <el-table-column label="藏品名称" prop="colName" min-width="100" />
          <el-table-column label="系列名称" prop="seriesName" min-width="100" />
          <el-table-column label="选择状态" min-width="95">
            <template v-slot="{ row }">
              <i v-if="activeIds.includes(row.colId)" class="el-icon-check text_green font_20" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 返回顶部 -->
        <el-backtop v-show="false" ref="backtopRef" target=".backtop2" />
      </div>
      <div class="border_top">
        <gb-pagination
          :page.sync="pageParams.pageNum"
          :limit.sync="pageParams.pageSize"
          :total="total"
          @pagination="_getList();$refs['backtopRef'].scrollToTop()"
          :auto-scroll="false" />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'

// 初始化查询参数
const initialQueryParams = {
  uid: '',
  nickName: '',
  auditStatus: 1,//已通过(非铸造中)
}

export default {
  name: 'CollectionMultiSelectDrawer',
  
  props: {
    // 是否可见
    visible: {
      type: Boolean,
      required: true
    },
    // 标题
    title: {
      type: String,
      default: '[ 标题 ]'
    },
    // 已选择藏品rows
    activeRows: {
      type: Array,
      required: true
    },
    activeIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      queryFormItems: [
        {label: '藏品名称', prop: 'colName'},
        {label: '系列名称', prop: 'seriesName'}
      ],
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0
    }
  },
  computed: {
    // 双向数据绑定visible
    syncedVisible: {
      get() {
        return this.visible;
      },
      set(newVal) {
        this.$emit('update:visible', newVal);
      }
    },
  },
  
  watch: {
    visible(val) {
      val && this._getList();
    }
  },

  methods: {
    /**获取藏品列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_collection_list({
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
    handleRowClick(row) {
      // ps: 注意要浅拷贝
      this.$emit('sel-row', { ...row });
    }
  },
}
</script>

<style lang="scss" scoped>
.content-scroll {
  overflow-y: auto;
  height: calc(100vh - 135px);
}
</style>