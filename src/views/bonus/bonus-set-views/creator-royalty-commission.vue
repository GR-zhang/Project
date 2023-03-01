<template>
  <div class="creator-royalty-commission table_card">
    <div class="page_title">创作者版税佣金</div>
    <div class="page_tip">
      <div>(1) 奖金说明：创作者的藏品在后续进行二级交易时,可按照创作者的等级获得二级交易佣金 </div>
      <div>奖金结算时机：订单支付成功后秒结</div>
      <div>奖金发放时机：订单支付成功后秒发</div>
      <div>奖金发放账号余额当中</div>
      <div>(2) 计算公式：(平台收取的)藏品交易手续费*奖金比例</div>
    </div>

    <div class="m_x_10">
      <el-button type="primary" v-if="!isEdit" @click="isEdit = true">立即编辑</el-button>
      <template v-else>
        <el-button type="danger" @click="_getList();isEdit = false">撤销</el-button>
        <el-button type="primary" :loading="loading_submit" @click="_setList">确认修改</el-button>
      </template>
    </div>
    <el-table v-loading="loading_table" :data="tableList" border>
      <el-table-column label="序号" prop="serialNumber" min-width="100px" />
      <el-table-column label="创作者类型" prop="createType" min-width="100px" />
      <el-table-column label="二级交易佣金比例" min-width="150px">
        <template v-slot="{ row }">
          <gb-input-number
            v-if="isEdit"
            limit-type="percentage" v-model="row.commissionRate" placeholder="请输入" unit="%" />
          <span v-else>{{ row.commissionRate }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

export default {
  name: 'CreatorRoyaltyCommission',

  data() {
    return {
      isEdit: false,
      loading_submit: false,
      // 表格
      loading_table: false,
      tableList: []
    }
  },

  created() {
    this._getList();
  },

  methods: {
    /**获取创作者版税佣金列表*/
    async _getList() {
      this.loading_table = true;
      try{
        let { data = {} } = await this.$api.get_creatorRoyaltyCommission_list();
        // 组织表格数据
        this.tableList = [
          {
            serialNumber: 1, 
            createType: '个人创作者', 
            commissionRate: precisionCalc.mul(data.personalDesignerCommission || 0, 100)
          },
          {
            serialNumber: 2, 
            createType: '企业创作者',
            commissionRate: precisionCalc.mul(data.teamDesignerCommission || 0, 100)
          }
        ]
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    },
    async _setList() {
      this.loading_submit = true;
      try{
        await this.$api.set_creatorRoyaltyCommission_list({
          personalDesignerCommission: precisionCalc.div(this.tableList[0].commissionRate || 0, 100),
          teamDesignerCommission: precisionCalc.div(this.tableList[1].commissionRate || 0, 100)
        });
        this._getList();
        this.$message.success('修改成功！');
        this.isEdit = false;
      }catch(e) {
        this._getList();
        throw e;
      }finally {
        this.loading_submit = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>