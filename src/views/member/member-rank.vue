<template>
  <div class="member-rank-container">
    <el-radio-group v-model="activePage" size="mini" class="mb_10">
      <el-radio-button v-for="item in options_page" :key="item.value"
        :label="item.value">{{ item.label }}</el-radio-button>
    </el-radio-group>
    <div class="table_card">
      <!-- 动态组件 -->
      <component :is="cpn[activePage]" />
    </div>
  </div>
</template>

<script>
import { MemberRankSet, RankChangeHistory } from './components'

export default {
  name: 'MemberRank',

  data() {
    return {
      activePage: 'MemberRankSet',
      options_page: [
        {label: '会员等级设置', value: 'MemberRankSet'},
        {label: '等级变动历史', value: 'RankChangeHistory'}
      ],
      // 组件选项对象
      cpn: {
        MemberRankSet,
        RankChangeHistory
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>