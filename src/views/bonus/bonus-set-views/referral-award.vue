<template>
  <div class="referral-award-container table_card">
    <div class="page_title">推荐奖</div>
    <div class="page_tip">
      <div>(1) 奖金说明：会员推荐别人注册成为自己的下级，一代被推荐人进行购物时其直接上级可以获得相应的奖金</div>
      <div>奖金结算时机：订单支付成功后秒结</div>
      <div>奖金发放时机：订单支付成功后秒发</div>
      <div>(2) 计算公式：一代被推荐人(一级/二级)交易手续费*奖金比例</div>
    </div>

    <div class="m_x_10">
      <el-button type="primary" v-if="!isEdit" @click="isEdit = true">立即编辑</el-button>
      <template v-else>
        <el-button type="danger" @click="_getList();isEdit = false">撤销</el-button>
        <el-button type="primary" :loading="loading_submit" @click="_setList">确认修改</el-button>
      </template>
    </div>
    <el-table v-loading="loading_table" :data="tableList" border>
      <el-table-column label="序号" prop="leveId" min-width="100px" />
      <el-table-column label="会员等级" prop="levelName" min-width="100px" />
      <el-table-column label="一级交易" min-width="150px">
        <template v-slot="{ row }">
          <gb-input-number
            v-if="isEdit"
            limit-type="percentage" v-model="row.reAward" placeholder="请输入" unit="%" />
          <span v-else>{{ row.reAward }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="二级交易" min-width="150px">
        <template v-slot="{ row }">
          <gb-input-number
            v-if="isEdit"
            limit-type="percentage" v-model="row.reAward2" placeholder="请输入" unit="%" />
          <span v-else>{{ row.reAward2 }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

export default {
  name: 'ReferralAward',

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
    /**获取推荐奖列表*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_referralAward_list();
        this.tableList = (res.data.rows || []).map(item => ({
          ...item,
          // 小数 => 百分比
          reAward: precisionCalc.mul(item.reAward, 100),
          reAward2: precisionCalc.mul(item.reAward2, 100)
        }));
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    },
    async _setList() {
      this.loading_submit = true;
      try{
        let data = this.tableList.map(item => ({
          ...item,
          // 百分比 => 小数 
          reAward: precisionCalc.div(item.reAward || 0, 100),
          reAward2: precisionCalc.div(item.reAward2 || 0, 100),
          upgrade: undefined,
          transFee: undefined,
          transFee2: undefined
        }))

        console.log('data', data);

        await this.$api.set_referralAward_list(data);
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