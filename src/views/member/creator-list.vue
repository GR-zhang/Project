<template>
  <div class="creator-list-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加创作者</el-button>
        <!-- <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button> -->
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
          <el-button type="text" @click="sel_id = row.designerId;dialogVisible_detail = true;">详情</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【添加或编辑】 -->
    <creator-add-or-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="创作者" :dialog-type="dialogType"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
    <!-- 对话框【详情】 -->
    <creator-detail-dialog
      :dialog-visible.sync="dialogVisible_detail"
      dialog-title="创作者详情"
      :id="sel_id" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { creatorTypeMap, generateOptionsByMap, multiTagInfo } from '@/config'

import { CreatorAddOrEditDialog, CreatorDetailDialog } from './components'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  contactInfo: '',
  designerType: undefined,
}

export default {
  name: 'CreatorList',
  mixins: [commonMixins],
  components: {CreatorAddOrEditDialog, CreatorDetailDialog},

  data() {
    return {
      // 表单
      loading_export: false,
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'contactInfo'},
        {
          type: 'select',
          label: '创作者类型',
          prop: 'designerType',

          options: generateOptionsByMap(creatorTypeMap)
        }
      ],
      // 表格
      tableColumns: [
        {label: '会员ID', prop: 'uid', minWidth: 150},
        {label: '会员昵称', prop: 'nickName', minWidth: 150},
        {
          type: 'img',
          label: '会员头像', 
          prop: 'head', 
          minWidth: 110
        },
        {
          type: 'multi-tag',
          label: '推荐创作者',
          prop: 'recommend',
          minWidth: 100,

          multiTagInfo: multiTagInfo.booleanStatus
        },
        {label: '手机号码', prop: 'contactInfo', minWidth: 100},
        {
          type: 'multi-tag',
          label: '创作者类型',
          prop: 'designerType',
          minWidth: 100,

          multiTagInfo: multiTagInfo.creatorType
        },
        {
          type: 'multi-tag',
          label: '状态', 
          prop: 'designerStatus', 
          minWidth: 90,
          
          multiTagInfo: multiTagInfo.userStatus
        },
        {
          type: 'timestamp',
          label: '入驻时间',
          prop: 'applyTime', 
          minWidth: 140
        }
      ],
      // 对话框【详情】
      dialogVisible_detail: false,
      sel_id: '',
    }
  },

  methods: {
    /**获取创作者列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_creator_list({
          params: this.pageParams,
          data: this.queryParams
        });
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
          designerType: 1,//默认创作者类型：个人认证
          designerStatus: 1,//默认状态：开启
          recommend: 2,//默认推荐创作者：否
          uid: '' //ps: 不加默认值，表单校验不通过
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
        apiFuncs: [this.$api.add_one_creator, this.$api.edit_one_creator],
        // 过滤接口多余参数
        data: {
          designerId: this.rowData.designerId,
          userId: this.rowData.uid,
          designerType: this.rowData.designerType,
          designerStatus: this.rowData.designerStatus,
          recommend: this.rowData.recommend
        }
      })
    },
    /**导出*/
    // async _handleExport() {
    //   tools.exportExcel(this, {
    //     apiFunc: this.$api.export_creator_list,
    //     data: this.queryParams,
    //     fileName: '创作者列表'
    //   })
    // }
  }
  
}
</script>

<style lang="scss" scoped>

</style>