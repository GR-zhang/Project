<template>
  <div class="card-vertical-data">
    <div class="table_card">
      <div class="page_title">{{ title }}</div>
      <div class="sec-card flex_row_center_center" v-for="(item, index) in syncedConfigs" :key="index">
        <span class="mr_10">{{ item.label }}</span>
        <span style="font-weight: bold;font-size: 20px;">
          <count-to :start-val="0" :end-val="item.value" :duration="800"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'CardVeticalData',
  components: { countTo },

  props: {
    // 标题
    title: {
      type: String,
      default: '[ 标题 ]'
    },
    // 接口函数
    apiFunc: {
      type: Function,
      require: true
    },
    // 配置项
    configs: {
      type: Array,// 格式[{label: '中文label', prop: '值属性字段名称'}]
      required: true
    }
  },
  computed: {
    syncedConfigs: {
      get() {
        return this.configs;
      },
      set(val) {
        this.$emit('update:configs', val);
      }
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取数据*/
    async _getData() {
      let res = await this.apiFunc();
      this.syncedConfigs =  this.syncedConfigs.map(item => ({
          ...item,
          value: Number.parseInt(res.data[item.prop]) || 0
      }))   
    }
  }
}
</script>

<style lang="scss" scoped>
.sec-card {
  height: 104px;
  padding: 20px 0;
  margin-bottom: 10px;
  background-color: rgb(237, 241, 250);
  border-radius: 15px;
}
</style>