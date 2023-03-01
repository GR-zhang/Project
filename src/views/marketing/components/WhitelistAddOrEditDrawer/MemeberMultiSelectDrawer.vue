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
          <el-table-column label="会员头像" min-width="70">
            <template v-slot="{ row }">
              <el-image :src="row.head" style="width: 45px;height:45px;" fit="containe" :preview-src-list="[row.head]" />
            </template>
          </el-table-column>
          <el-table-column label="会员ID" prop="uid" min-width="100" />
          <el-table-column label="会员昵称" prop="nickName" min-width="100" />
          <el-table-column label="选择状态" min-width="95">
            <template v-slot="{ row }">
              <i v-if="activeIds.includes(row.uid)" class="el-icon-check text_green font_20" />
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
  nickName: ''
}

export default {
  name: 'MemeberMultiSelectDrawer',
  
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
    // 已选择会员rows
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
        {label: '会员ID', prop: 'uid', inputType: 'id-19-bit'},
        {label: '会员昵称', prop: 'nickName'}
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
    /**获取会员列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_memberMng_list({
          data: this.queryParams,
          params: this.pageParams
        })
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'phone': item.userName
        }))
        return res;
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