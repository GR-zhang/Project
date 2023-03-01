<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="800px"
  >
    <gb-table-display
      :table-loading="loading_table"
      :table-columns="tableColumns"
      :table-list="tableList"

      :has-operation-column="false"
      :tab-options="tabOptions"
      @tab-change="(val) => { depositStatus = val; _getList(); }" />
    <gb-pagination
      :page.sync="pageParams.pageNum"
      :limit.sync="pageParams.pageSize"
      :total="total"
      @pagination="_getList" />
    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { marginStatusMap_2, generateOptionsByMap } from '@/config'
import { sharedPageParams, tools } from '@/mixins'


export default {
  name: 'MarginRecordDialog',

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
    // id
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 查询参数
      depositStatus: '',
      pageParams: { ...sharedPageParams },
      // 表格
      tabOptions: generateOptionsByMap(marginStatusMap_2),
      loading_table: false,
      tableList: [],
      total: 0,
      tableColumns: [
        {label: '会员昵称', prop: 'nickName', minWidth: 100},
        {label: '手机号码', prop: 'userName', minWidth: 100},
        {
          type: 'timestamp',
          label: '支付时间',
          prop: 'createTime',
          minWidth: 100
        },
        {label: '保证金', prop: 'deposit', minWidth: 100},
        {label: '状态', prop: 'depositStatusTag', minWidth: 100}
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
    id(val) {
      this._getList();
    }
  },

  methods: {
    // 关闭对话框
    handleCloseDialog() {
      this.syncedDialogVisible = false;
    },
    // 获取保证金记录列表
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_marginRecord_list({
          activityId: this.id,
          depositStatus: this.depositStatus,
          ...this.pageParams
        })
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          'depositStatusTag': marginStatusMap_2.get(item.depositStatus)
        }))
        return res;
      })
    }
  }
}
</script>

<style lang="scss">

</style>