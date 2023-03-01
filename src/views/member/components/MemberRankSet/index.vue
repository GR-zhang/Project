<template>
  <div class="member-rank-set">
    <el-button type="primary" size="mini" @click="openAddOrEditDialog('add')">添加会员等级</el-button>
    <!-- 表格 -->
    <gb-table-display
      :table-loading="loading_table"
      :table-columns="tableColumns"
      :table-list="tableList"
    >
      <template v-slot="{ row }">
        <el-button type="text" :loading="row.loading_edit" @click="openAddOrEditDialog('edit', row)">修改</el-button>
        <!-- <el-button class="text_red" type="text" @click="_handleDel(row)">删除</el-button> -->
      </template>
    </gb-table-display>
    <gb-pagination
      :page.sync="pageParams.pageNum"
      :limit.sync="pageParams.pageSize"
      :total="total"
      @pagination="_getList" />
    <!-- 对话框 -->
    <member-rank-set-dialog
      :dialog-visible.sync="dialogVisible"
      dialogTopic="会员等级" :dialog-type="dialogType"
      :row-data="rowData"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit" />
  </div>
</template>

<script>
import MemberRankSetDialog from './MemberRankSetDialog'
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { formatAmount } from '@/utils'
import precisionCalc from '@/utils/precision-calc'

// 升级条件默认参数
const default_upgrade = {
  twoTotalConsumption: undefined,
  pushStraightMember: undefined,
  umbrellaTeam: undefined,
  directPushNum: undefined,
  umbrellaTeamSum: undefined
};

export default {
  name: 'MemberRankSet',
  components: { MemberRankSetDialog },
  mixins: [commonMixins],

  data() {
    return {
      pageParams: { ...sharedPageParams },
      // 表格
      tableColumns: [
        {label: '序号', prop: 'leveId', minWidth: 140},
        {label: '会员级别', prop: 'levelName', minWidth: 140},
        {
          type: 'multi-line-arr',
          label: '升级条件',
          prop: 'upgradeConditions',
          minWidth: 250
        },
        {
          type: 'timestamp',
          label: '创建时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 表单
      rowData: {
        upgrade: { ...default_upgrade }
      }
    }
  },

  methods: {
    /**获取会员等级列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_memberRank_list({
          data: {},
          params: this.sharedPageParams
        });
        res.data.rows = (res.data.rows || []).map(item => {
          // 计算得出升级条件label
          let upgradeConditions = [];
          if(item.upgrade.twoTotalConsumption) {
            upgradeConditions.push(`消费金额总计达到 ${item.upgrade.twoTotalConsumption} 元`);
          }
          if(item.upgrade.pushStraightMember) {
            upgradeConditions.push(`直推会员人数达到 ${item.upgrade.pushStraightMember} 人`);
          }
          if(item.upgrade.umbrellaTeam) {
            upgradeConditions.push(`伞下团队人数(不含自己)达到 ${item.upgrade.umbrellaTeam} 人`);
          }
          if(item.upgrade.directPushNum) {
            upgradeConditions.push(`直推团队消费总额达到 ${item.upgrade.directPushNum} 元`);
          }
          if(item.upgrade.umbrellaTeamSum) {
            upgradeConditions.push(`伞下团队人数(不含自己)消费金额总计达到 ${item.upgrade.umbrellaTeamSum} 元`);
          }

          return {
            ...item,
            upgradeConditions,
            upgrade: item.upgrade['条件'] ? { ...default_upgrade } : item.upgrade,
            // 小数 => 百分比
            transFee: precisionCalc.mul(item.transFee || 0, 100),
            transFee2: precisionCalc.mul(item.transFee2 || 0, 100)
          }
        });
        return res;
      })
    },
    resetQuery() {
      this._getList();
    },
    /**打开对话框*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          selConditions: [],
          upgrade: { ...default_upgrade }
        };
      }else {

        this.rowData = { ...row, selConditions: [] };
        // 计算得出选中的升级条件(selConditions)
        if(row.upgrade.twoTotalConsumption) {
          this.rowData.selConditions.push(1);
        }
        if(row.upgrade.pushStraightMember) {
          this.rowData.selConditions.push(2);
        }
        if(row.upgrade.umbrellaTeam) {
          this.rowData.selConditions.push(3);
        }
        if(row.upgrade.directPushNum) {
          this.rowData.selConditions.push(4);
        }
        if(row.upgrade.umbrellaTeamSum) {
          this.rowData.selConditions.push(5);
        }
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_one_memberRank, this.$api.edit_one_memberRank],
        // 未选中的升级条件，需把对应字段赋值为undefind
        data: { 
          ...this.rowData,
          upgrade: {
            // formatAmount: 金额后端需要保留两位小数
            twoTotalConsumption: this.rowData.selConditions.includes(1) ? 
              formatAmount(this.rowData.upgrade.twoTotalConsumption) : undefined,
            pushStraightMember: this.rowData.selConditions.includes(2) ? 
              this.rowData.upgrade.pushStraightMember : undefined,
            umbrellaTeam: this.rowData.selConditions.includes(3) ? 
              this.rowData.upgrade.umbrellaTeam : undefined,
            directPushNum: this.rowData.selConditions.includes(4) ? 
              formatAmount(this.rowData.upgrade.directPushNum) : undefined,
            umbrellaTeamSum: this.rowData.selConditions.includes(5) ? 
              formatAmount(this.rowData.upgrade.umbrellaTeamSum) : undefined,
          },
          // 百分比 => 小数
          transFee: precisionCalc.div(this.rowData.transFee || 0, 100),
          transFee2: precisionCalc.div(this.rowData.transFee2 || 0, 100)
        }
      })
    },
    /**删除*/
    // _handleDel(row) {
    //   tools.delOne(this, {
    //     comfirmInfo: `是否删除该会员等级【${row.levelName}】？`,
    //     callback: async () => {
    //       return this.$api.del_one_memberRank(row.leveId);
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>