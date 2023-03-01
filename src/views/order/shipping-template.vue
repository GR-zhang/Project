<template>
  <div class="shipping-template-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加模板</el-button>
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
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button class="text_red" type="text" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框 -->
    <shipping-tmplate-add-or-edit-dialog 
      :dialog-visible.sync="dialogVisible"
      :dialog-type="dialogType" dialogTopic="运费模板"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { billingMethodMap, generateOptionsByMap } from '@/config'

import { ShippingTmplateAddOrEditDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  shippingId: undefined,
  shippingName: '',
  method: undefined,
  dateTimeRange_create: [],
  createEndTime: '',
  createStartTime: '',
  dateTimeRange_update: [],
  updateEndTime: '',
  updateStartTime: '',
}

export default {
  name: 'ShippingTemplate',
  mixins: [commonMixins],
  components: {ShippingTmplateAddOrEditDialog},

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '模板ID', prop: 'shippingId', inputType: 'id-19-bit'},
        {label: '模板名称', prop: 'shippingName'},
        {
          type: 'select',
          label: '计费方式',
          prop: 'method',
          options: generateOptionsByMap(billingMethodMap)
        },
        {
          type: 'datetime-range',
          label: '创建时间',
          prop: 'dateTimeRange_create',

          assignFields: ['createStartTime', 'createEndTime']
        },
        {
          type: 'datetime-range',
          label: '更新时间',
          prop: 'dateTimeRange_update',

          assignFields: ['updateStartTime', 'updateEndTime']
        },
      ],
      loading_export: false,
      // 表格
      tableColumns: [
        {label: '权重', prop: 'weigh', minWidth: 100},
        {label: '模板ID', prop: 'shippingId', minWidth: 100},
        {label: '模板名称', prop: 'shippingName', minWidth: 150},
        {
          type: 'multi-tag',
          label: '计费方式',
          prop: 'method',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '按件数', tagType: 'warning'},
            2: {tagText: '按重量', tagType: 'info'}
          }
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
      ],
    }
  },

  methods: {
    /**获取运费模板列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_shippingTemplate_list({
          params: this.pageParams,
          data: this.queryParams
        });
        
        res.data.rows = (res.data.rows || []).map(item => {
          let shippingRuleVOS_new = (item.shippingRuleVOS || []).map(item => ({
            ...item,
            // 补充编辑字段
            isEdit: false
          }));

          return {
            ...item,
            shippingRuleVOS: shippingRuleVOS_new
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
          method: 1,//默认计费方式：按件数
          shippingRuleVOS: [],
        };
      }else {
        this.rowData = JSON.parse(JSON.stringify(row));
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_one_shippingTemplate, this.$api.edit_one_shippingTemplate],
        data: { 
          ...this.rowData,
          // 过滤接口多余参数
          shippingRuleDTOList: this.rowData.shippingRuleVOS,
          shippingRuleVOS: undefined,
          createTime: undefined,
          updateTime: undefined,
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该运费模板【${row.shippingName}】？`,
        callback: async () => {
          return this.$api.del_one_shippingTemplate(row.shippingId);
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>