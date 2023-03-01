<template>
  <div class="creater-select">
    <el-button class="mr_10" type="info" size="mini" @click="dialogVisible = true" :disabled="disabled">选择</el-button>
    <el-tag v-if="syncedTagName" type="danger" effect="plain" size="medium">{{ syncedTagName }}</el-tag>

    <el-dialog
      class="dialog-back"
      title="创作者选择" :visible.sync="dialogVisible"
      :close-on-click-modal="false" width="700px" append-to-body
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
            :type="syncedActiveId == row.designerId ? 'success' : 'info'" size="mini"
            @click="handleSelOne(row)"
          >
            {{ syncedActiveId == row.designerId ? '当前选择' : '选择'}}
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
  </div>
</template>

<script>
import { sharedPageParams, tools } from '@/mixins'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  auditState: 2 //审核通过的
}

export default {
  name: 'CreaterSelect',
  model: {
    prop: 'activeId',
    event: 'change'
  },
  
  props: {
    // 当前选择id
    activeId: {
      required: true
    },
    // tagName
    tagName: {
      required: true,
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 表单
      queryParams: { ...initialQueryParams },
      queryFormItems: [
        {label: '创作者昵称', prop: 'nickName'}
      ],
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
       tableColumns: [
        {
          type: 'img',
          label: '头像',
          prop: 'head', 
          minWidth: 110
        },
        {label: '创作者昵称', prop: 'nickName', minWidth: 150}
      ],
    }
  },
  computed: {
    syncedActiveId: {
      get() {
        return this.activeId;
      },
      set(val) {
        this.$emit('change', val)
      }
    },
    syncedTagName: {
      get() {
        return this.tagName;
      },
      set(val) {
        this.$emit('update:tagName', val)
      }
    }
  },
  
  watch: {
    dialogVisible(val) {
      val && this._getList();
    }
  },

  methods: {
    /**获取创作者列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_creator_list({
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
    async handleSelOne(row) {
      this.syncedActiveId = row.designerId;
      this.syncedTagName = row.nickName;
      
      this.$emit('validate');
      this.dialogVisible = false;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>