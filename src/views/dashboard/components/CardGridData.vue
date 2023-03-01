<template>
  <div class="card-grid-data">
    <div class="table_card">
      <div class="page_title">{{ title }}</div>
      <div class="grid">
        <div class="grid_item" v-for="(item, index) in syncedConfigs" :key="index">
          <div>{{ item.label }}</div>
          <div class="grid_value">
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
  name: 'CardGridData',
  components: { countTo },

  props: {
    // 标题
    title: {
      type: String,
      default: '[ 标题 ]'
    },
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
.grid {
  display: grid;
  grid: 130px 130px / auto auto;

  &_item {
    padding-top: 30px;
    text-align: center;
  }
  &_value {
    padding-top: 30px;
    font-size: 30px;
  }
}

</style>