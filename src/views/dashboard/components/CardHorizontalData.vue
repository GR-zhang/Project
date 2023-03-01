<template>
  <div class="card-horizontal-data">
    <div class="table_card">
      <div class="page_title">{{ title }}</div>
      <div class="flex_row_sb_center">
        <div 
          v-for="(item, index) in syncedConfigs" :key="index"
          class="sec-card"  :style="{flex: 1, marginRight: index != (syncedConfigs.length -1) ? '20px' : '0px'}"
        >
          <div>{{ item.label }}</div>
          <div class="sec-card_value">
            <count-to :start-val="0" :end-val="item.value" :duration="800"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'CardHorizontalData',
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
    apiParams: {
      type: Object
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
      let res = await this.apiFunc(this.apiParams || {});
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
  height: 170px;
  padding-top: 40px;
  text-align: center;
  background-color: rgb(237, 241, 250);
  border-radius: 15px;

  &_value{
    padding-top: 30px;
    font-size: 30px;
  }
}
</style>