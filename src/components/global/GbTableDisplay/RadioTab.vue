<template>
  <div class="radio-tab">
    <div class="radio-tab-item"
      v-for="(item, index) in options" :key="index"
      :class="item.value == tabVal ? 'active' : ''"
      @click="handleItemClick(item.value)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
/**RadioTab组件说明
 * 样式类似于el-tabs的 查询条件组件
 * 当切换tab时，会根据选中的查询参数 请求新的表格数据
*/
export default {
  name: 'RadioTab',
  
  props: {
    tabVal: {
      required: true,
    },
    options: {
      type: Array,
      required: true
    }
  },

  methods: {
    handleItemClick(val) {
      this.$emit('tab-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-tab {
  font-size: 15px;
  color: #909399;

  .radio-tab-item {
    display: inline-block;
    padding: 10px 4px;
    margin-right: 25px;
    cursor: pointer;
    transition: color .7s;//过渡
  }
}

//选择时状态
.active.radio-tab-item {
  color: #409EFF;
  border-bottom: 2px solid  #409EFF;
}
</style>
