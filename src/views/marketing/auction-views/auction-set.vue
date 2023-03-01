<template>
  <div class="auction-set-container">
    <!-- <protocol-page title="协议规则" :api-func="$api.get_auctionProtocol_list" /> -->
    <!-- 竞拍手续费 -->
    <handling-free :form-data.sync="handlingFreeData" :edit-disabled="loading_data" />
    <!-- 竞拍时间 -->
    <AuctionTime :form-data.sync="auctionTimeData" :edit-disabled="loading_data" />
  </div>
</template>

<script>
import { ProtocolPage } from '@/components/business'
import { HandlingFree, AuctionTime } from './components/auction-set'

import precisionCalc from '@/utils/precision-calc'

export default {
  name: 'AuctionSet',
  components: { 
    ProtocolPage,

    HandlingFree,
    AuctionTime
  },

  data() {
    return {
      loading_data: false,
      handlingFreeData: {},
      auctionTimeData: {}
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取 所有基础设置 数据*/
    async _getData() {
      this.loading_data = true;
      try{
        let { data }  = await this.$api.get_allAuctionSet_list();
        // 竞拍手续费
        this.handlingFreeData = {
          britishAuctionFee: precisionCalc.mul(data.britishAuctionFee || 0, 100),
          dutchAuctionFee: precisionCalc.mul(data.dutchAuctionFee || 0, 100)
        };
        // 竞拍时间
        this.auctionTimeData = {
          auctionOrderTimeout: precisionCalc.div(data.auctionOrderTimeout || 0, 60),
          auctionBidCountdown: precisionCalc.div(data.auctionBidCountdown || 0, 60)
        };
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>