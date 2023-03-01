<template>
  <div class="synthesis-combo-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加合成套餐</el-button>
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
          <el-button
            v-if="row.activityStatus == 2"
            class="text_green" type="text" @click="_openOrClose(row, 1)"
          >开启</el-button>
          <el-button
            v-if="row.activityStatus == 1"
            class="text_red" type="text" @click="_openOrClose(row, 2)">关闭</el-button>          
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
          <el-button type="text" @click="openAddOrEditDialog('detail', row)">查看详情</el-button>
          <el-button class="text_red" type="text" @click="_handleDel(row)">删除</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
      <!-- 抽屉【添加或编辑】 -->
      <synthesis-combo-add-or-edit-drawer
        ref="blindboxAddOrEditDrawerRef"
        :drawer-visible.sync="dialogVisible"
        drawer-topic="合成套餐" :drawer-type="dialogType"
        :id="id"
        :submit-loading.sync="loading_submit"
        @submit="_handleSubmit" />
    </div>
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { userStatusMap, generateOptionsByMap, multiTagInfo } from '@/config'
import { submitDataConvert } from '@/utils/lang-data-hanlde'

import { SynthesisComboAddOrEditDrawer } from './components'

// 初始化查询参数
const initialQueryParams = {
  activityName: '',
  status: undefined,
  datetimeRange_start: [],
  startTimeBegin: undefined,
  startTimeEnd: undefined,
  datetimeRange_end: [],
  endTimeBegin: undefined,
  endTimeEnd: undefined
}

export default {
  name: 'SynthesisCombo',
  mixins: [commonMixins],
  components: { SynthesisComboAddOrEditDrawer }, 

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '合成标题', prop: 'activityName'},
        {
          type: 'select',
          label: '状态',
          prop: 'activityStatus',
          
          options: generateOptionsByMap(userStatusMap)
        },
        {
          type: 'datetime-range',
          label: '合成开始时间',
          prop: 'datetimeRange_start',

          assignFields: ['startTimeBegin', 'startTimeEnd']
        },
        {
          type: 'datetime-range',
          label: '合成结束时间',
          prop: 'datetimeRange_end',

          assignFields: ['endTimeBegin', 'endTimeEnd']
        },
      ],
      // 表格
      tableColumns: [
        {label: '合成标题', prop: 'activityName', minWidth: 130},
        {
          type: 'img',
          label: '合成套餐主图',
          prop: 'activityImage',
          minWidth: 110
        },
        {
          type: 'img',
          label: '合成目标主图',
          prop: 'targetColPicture',
          minWidth: 110
        },
        {label: '合成限量份数', prop: 'limitSynthesizedQuantity', minWidth: 100},
        {label: '剩余份数', prop: 'residueQuantity', minWidth: 100},
        {label: '已合成数量', prop: 'synthesizedQuantity', minWidth: 100},
        {
          type: 'multi-tag',
          label: '状态',
          prop: 'activityStatus',
          minWidth: 100,

          multiTagInfo: multiTagInfo.userStatus
        },
        {label: '初始素材转移账户', prop: 'receiveUserNickname', minWidth: 140},
        {
          type: 'timestamp',
          label: '开始时间',
          prop: 'startTime',
          minWidth: 140
        },
        {
          type: 'timestamp',
          label: '结束时间',
          prop: 'endTime',
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
        }
      ],
      // 抽屉【添加或编辑】
      id: ''
    }
  },

  methods: {
    /**获取合成套餐列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_systhesisCombo_list({
          ...this.pageParams,
          ...this.queryParams
        });    
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**开启或关闭*/
    _openOrClose(row, status) {
      let operationName = status == 1 ? '开启' : '关闭';

      tools.comfirmOne(this, {
        comfirmInfo: `是否${operationName}该合成套餐【${row.activityName}】？`,
        successTip: `${operationName}成功`,
        callback: async () => {
          return this.$api.open_or_close_one_systhesisCombo({
            id: row.activityId,
            activityStatus: status
          });
        }
      })
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      // 非添加都要传id
      type != 'add' && (this.id = row.activityId);

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      // ps: 接口所需参数转换处理
      this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.materialsList = 
        this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.materialsList.map(item => ({
          ...item,
          'cols': item.productList.map(_item => _item.colId)
        }))
     
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_systhesisCombo, this.$api.add_or_edit_one_systhesisCombo],
        data: { 
          ...this.$refs['blindboxAddOrEditDrawerRef'].detailInfo,
          synthesizePackageLangDTOS: submitDataConvert(this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.synthesizeLangPOS_convert) 
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该合成套餐【${row.activityName}】？`,
        callback: async () => {
          return this.$api.del_one_systhesisCombo(row.activityId);
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>