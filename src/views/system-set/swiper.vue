<template>
  <div class="swiper-container">
    <!-- 表单 -->
    <div class="table_card flex_row_sb_center">
      <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加轮播图</el-button>
      <RadioLang v-model="activeLang"/>
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"

        @switch-change="row => _toggleStatus(row)"
      >
        <template v-slot:slot-column="{ row }">
          <div>
            {{ row.tag }} {{ row.jumpType == 1 ? row.colName : row.url }}
          </div>
        </template>
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
    <!-- 对话框【添加或编辑】 -->
    <swiper-add-or-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="轮播图" :dialog-type="dialogType"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { getLocale, getValue } from '@/utils/lang-data-hanlde'

import { SwiperAddOrEditDialog } from './components'
import { RadioLang } from '@/components/business'

export default {
  name: 'Swiper',
  mixins: [commonMixins],
  components: { SwiperAddOrEditDialog, RadioLang },

  data() {
    return {
      // 表单
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '系列名称', prop: 'seriesName'},
        {label: '所属创作者', prop: 'userName'}
      ],
      activeLang: getLocale(),
      // 表格
      tableColumns: [
        {label: '权重', prop: 'weight', minWidth: 150},
        {
          type: 'img',
          label: '轮播图',
          prop: 'imgUrl', 
          minWidth: 110
        },
        {
          type: 'slot-column',
          label: '跳转类型',
          minWidth: 150
        },
        {
          type: 'switch',
          label: '状态',
          prop: 'status',
          minWidth: 150
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        }
      ]
    }
  },

  methods: {
    /**获取会员列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_swiper_list(this.pageParams);
        res.data.rows = (res.data.rows || []).map(item => {

          let jumpType, tag, colId, url;
          // 由跳转url得出跳转类型
          if(!item.linkUrl) {
            jumpType = 3;
            tag = '不跳转';
          }else if(isNaN(Number(item.linkUrl))) {
            jumpType = 2;
            tag = '跳转链接';
            url = item.linkUrl;
          }else {
            jumpType = 1;
            tag = '跳转商品';
            colId = item.linkUrl;
          }

          return {
            ...item,
            jumpType,
            tag,
            colId,
            url,
            linkUrl: undefined
          }
        })
        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };

      this._getList();
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          jumpType: 1,// 跳转类型：跳转藏品
          colId: '',//ps: 不加默认值，表单校验不通过
          url: '',

          status: 1,//默认状态: 开启
          title: '默认标题'
        };
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      let linkUrlMapObj = {
        1: this.rowData.colId,
        2: this.rowData.url,
        3: ''
      }

      tools.submitOne(this, {
        apiFuncs: [this.$api.add_or_edit_one_swiper, this.$api.add_or_edit_one_swiper],
        data: {
          ...this.rowData,
          linkUrl: linkUrlMapObj[this.rowData.jumpType],
          langId: Number.parseInt(getValue())
        }
      })
    },
    /**删除*/
    _handleDel(row) {
      tools.delOne(this, {
        comfirmInfo: `是否删除该轮播图？`,
        callback: async () => {
          return this.$api.del_one_swiper(row.id);
        }
      })
    },
    /**切换状态*/
    async _toggleStatus(row) {
      try{
        await this.$api.add_or_edit_one_swiper({ 
          ...row,
          langId: Number.parseInt(getValue())
        });
        this.$message.success('切换成功！');
      }catch(e) {
        this._getList();
        throw e;
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>