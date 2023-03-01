<template>
  <div class="blindbox-activity-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加盲盒</el-button>
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
          <!-- 未上架、上架中显示 -->
          <el-button
            v-if="[1, 4].includes(row.listedStatus)"
            class="text_green" type="text" @click="_upOrDownOne(row, 3)">上架</el-button>
          <!-- 上架中、已上架显示 -->
          <el-button
            v-if="[2, 3].includes(row.listedStatus)"
            class="text_red" type="text" @click="_upOrDownOne(row, 4)"
          >下架</el-button>
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
      <blindbox-add-or-edit-drawer
        ref="blindboxAddOrEditDrawerRef"
        :drawer-visible.sync="dialogVisible"
        drawer-topic="盲盒" :drawer-type="dialogType"
        :id="boxId"
        :submit-loading.sync="loading_submit"
        @submit="_handleSubmit" />
    </div>
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { submitDataConvert } from '@/utils/lang-data-hanlde'

import { BlindboxAddOrEditDrawer } from './components'

// 初始化查询参数
const initialQueryParams = {
  boxName: '',
  colName: ''
}

export default {
  name: 'BlindboxActivity',
  mixins: [commonMixins],
  components: { BlindboxAddOrEditDrawer }, 

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '盲盒名称', prop: 'boxName'},
        {label: '盲盒款式名称', prop: 'colName'}
      ],
      // 表格
      tableColumns: [
        {label: 'ID', prop: 'boxId', minWidth: 80},
        {label: '盲盒名称', prop: 'boxName', minWidth: 130},
        {
          type: 'img',
          label: '盲盒主图',
          prop: 'picture',
          minWidth: 110
        },
        {label: '限量份数', prop: 'limitedNum', minWidth: 100},
        {label: '剩余份数', prop: 'stock', minWidth: 100},
        {label: '销售单价', prop: 'boxPrice', minWidth: 100},
        {
          type: 'multi-tag',
          label: '盲盒状态',
          prop: 'listedStatus',
          minWidth: 100,

          multiTagInfo: {
            1: {tagText: '未上架', tagType: 'info'},
            2: {tagText: '上架中', tagType: 'primary'},
            3: {tagText: '已上架', tagType: 'success'},
            4: {tagText: '已下架', tagType: 'danger'}
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
        }
      ],
      // 抽屉【添加或编辑】
      boxId: ''
    }
  },

  methods: {
    /**获取盲盒列表*/
    async _getList() {
      tools.setData(this, async () => {
        return await this.$api.get_blindbox_list({
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
    /**上架或下架*/
    _upOrDownOne(row, publishStatus) {
      if(publishStatus == 3) {//上架
        tools.upOne(this, {
          comfirmInfo: `是否上架该盲盒【${row.boxName}】？`,
          callback: async () => {
            return this.$api.up_or_down_one_blindbox({
              boxId: row.boxId,
              status: publishStatus
            });
          }
        })
      }else if(publishStatus == 4) {//下架
        tools.downOne(this, {
          apiFunc: this.$api.up_or_down_one_blindbox,
          params: {
            boxId: row.boxId,
            status: publishStatus
          },
          // todo: 下架理由字段待修改
          reasonField: 'reason'
        })
      }
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      // 非添加都要传boxId
      type != 'add' && (this.boxId = row.boxId);

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      // ps: 添加时输入框是活动库存，而编辑是活动剩余库存，需加上已抽取数量
      let blindBoxGoodsDTOList = null;
      if(this.dialogType == 'edit') {
        let data_copy = JSON.parse(JSON.stringify(this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.blindBoxGoodsVOList));
        blindBoxGoodsDTOList = data_copy.map(item => ({
          ...item,
          'colStock': item.surplusStock + (item.extractNum || 0)
        }))
      }else {
        blindBoxGoodsDTOList = this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.blindBoxGoodsVOList;
      }

      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_blindbox, this.$api.add_or_edit_one_blindbox],
        data: { 
          boxId: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.boxId,
          picture: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.picture,
          thumb: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.thumb,
          boxName: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.boxName,
          preSaleTime: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.isPreSale ? 
            this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.preSaleTime / 1000
            :
            0,
          boxPrice: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.boxPrice,
          rightsExplain: this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.rightsExplain,
          blindBoxGoodsDTOList,
          blindBoxLangVOList: submitDataConvert(this.$refs['blindboxAddOrEditDrawerRef'].detailInfo.blindBoxLangPOList_convert)
        }
      })
    },
    /**查看详情*/
    viewDetail(row) {
      this.rowData_detail = { ...row };
      this.drawerVisible_detail = true;
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该盲盒【${row.boxName}】？`,
        callback: async () => {
          return this.$api.up_or_down_one_blindbox({
            boxId: row.boxId,
            status: 5// 5是删除
          });
        }
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>