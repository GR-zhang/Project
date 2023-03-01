<template>
  <el-dialog
    class="dialog-back"
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="850px"
  >
    <el-form      
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData"
      label-position="left" label-width="75px"
    > 
      <el-form-item label="盲盒名称"><span>{{ rowData.boxName }}</span></el-form-item>
      <el-form-item label="开售时间"><span>{{ rowData.preSaleTime * 100 | parseTime }}</span></el-form-item>

      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      
        :has-operation-column="false" />
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList();$refs['backtopRef'].scrollToTop()" />
    </el-form>
    <span slot="footer">
      <el-button @click="syncedDialogVisible = false" size="medium">关闭</el-button>
    </span>

    <!-- 返回顶部 -->
    <el-backtop ref="backtopRef" target=".dialog-back"></el-backtop>
  </el-dialog>
</template>

<script>
import { sharedPageParams } from '@/mixins'

export default {
  name: 'BlindboxRecordDetailDialog',

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
    // 对话框表单参数对象
    rowData: {
      required: true
    },
  },
  data() {
    return {
      pageParams: { ...sharedPageParams },
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '藏品名称', prop: 'colName', minWidth: 130},
        {
          type: 'img',
          label: '藏品主图',
          prop: 'picture',
          minWidth: 110
        },
        {label: '开出会员昵称', prop: 'nickName', minWidth: 130},
        {
          type: 'multi-tag',
          label: '开出状态',
          prop: 'isOpen',
          minWidth: 100,

          multiTagInfo: {
            2: {tagText: '未开出', tagType: 'info'},
            1: {tagText: '已开出', tagType: 'success'},
          }
        },
        {
          type: 'timestamp',
          label: '开出时间',
          prop: 'updateTime',
          width: 140
        }
      ]
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
    rowData(val) {
      // 重置参数和返回顶部
      this.pageParams = { ...sharedPageParams };
      try{
        this.$refs['backtopRef'].scrollToTop();
      }catch(e) {}

      this._getList();
    }
  },

  methods: {
    /**获取得到盲盒的用户列表*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_getBlindboxUsers_list({
          boxId: this.rowData.boxId,
          ...this.pageParams
        });
        this.tableList = res.data.rows || [];
        this.total = Number.parseInt(res.data.total);
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    }
  }
}
</script>

<style lang="scss">

</style>