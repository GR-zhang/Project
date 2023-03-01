<template>
  <div class="buy-first-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加优先购</el-button>
      </div>
      <gb-form-query
        :queryParams="queryParams"
        :queryFormItems="queryFormItems"
        @search-btn-click="filterQuery"
        @reset-btn-click="resetQuery"
        @text-input-keyup-enter="filterQuery" />
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      >
        <template v-slot="{ row }">
          <el-button type="text" :loading="row.loading_edit" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <!-- 状态关闭显示 -->
          <el-button v-if="row.activityStatus == 2" class="text_red" type="text" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【添加或编辑】 -->
    <buy-first-add-or-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="优先购" :dialog-type="dialogType"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { switchStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { BuyFirstAddOrEditDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  colName: '',
  activityStatus: undefined,
}

export default {
  name: 'CreatorList',
  mixins: [commonMixins],
  components: { BuyFirstAddOrEditDialog },

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '藏品名称', prop: 'colName'},
        {
          type: 'select',
          label: '状态',
          prop: 'activityStatus',

          options: generateOptionsByMap(switchStatusMap)
        }
      ],
      // 表格
      tableColumns: [
        {label: 'ID', prop: 'activityId', minWidth: 100},
        {label: '藏品名称', prop: 'colName', minWidth: 150},
        {
          type: 'multi-tag',
          label: '状态',
          prop: 'activityStatus',
          minWidth: 100,

          multiTagInfo: multiTagInfo.userStatus
        },
        {
          type: 'timestamp',
          label: '预售时间',
          prop: 'preSaleTime', 
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '优先购时间',
          prop: 'buyFirstTime', 
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime', 
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '更新时间',
          prop: 'updateTime', 
          minWidth: 140
        },
      ]
    }
  },

  methods: {
    /**获取创作者列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_buyFirst_list({
          params: this.pageParams,
          data: this.queryParams
        });
        res.data.rows = (res.data.rows || []).map(item => {
          let param = JSON.parse(item.param) || [];``
          // 兼容: 优先购条件未白名单, param需转为字符串数组,否则下拉框显示id
          item.activityMode == 2 && (param = param.map(item => String(item)));

          return {
            ...item,
            earlyTime: item.earlyTime / 60,// 秒=>分
            'buyFirstTime': Number.parseInt(item.preSaleTime) - item.earlyTime,
            'typeIds_rank': item.activityMode == 1 ? param : [],
            'typeIds_whitelist': item.activityMode == 2 ? param : []
          }
        })
        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          colId: '', //ps: 不加默认值，表单校验不通过
          activityMode: 1,//默认优先购条件：会员等级
          'typeIds_rank': [],
          'typeIds_whitelist': [],
          activityStatus: 1,//默认状态：开启
        };
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_buyFirst, this.$api.add_or_edit_one_buyFirst],
        // 过滤接口多余参数
        data: {
          activityId: this.rowData.activityId,
          colId: this.rowData.colId,
          earlyTime: this.rowData.earlyTime * 60,// 分=>秒
          activityMode: this.rowData.activityMode,
          param: this.rowData.activityMode == 1 ? this.rowData.typeIds_rank : this.rowData.typeIds_whitelist,
          activityStatus: this.rowData.activityStatus
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该优先购活动【${row.activityName}】`,
        callback: async () => {
          return this.$api.del_one_buyFirst(row.activityId);
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>