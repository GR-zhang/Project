<template>
  <el-select
    class="gb-select-api"
    v-bind="$attrs"

    v-model="syncedValue"
    filterable clearable
  >
    <el-option
      v-for="item in options" :key="item.value"
      :label="item.label" :value="item.value" />
  </el-select>
</template>

<script>
/**GbSelectApi组件说明
 * el-select组件的options数据从后端获取推荐使用(封装了接口数据的处理)
*/
export default {
  name: 'GbSelectApi',
  inheritAttrs: false,

  props: {
    // 控件值
    value: {
      required: true
    },
    // 接口函数
    apiFunc: {
      type: Function,
      required: true
    },
    // 接口数据label与value的别名
    props: {
      type: Object,//格式{label: '别名', value: '别名'}
      required: true
    }
  },
  data() {
    return {
      options: []
    }
  },
  computed: {
    syncedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },

  created() {
    this.assignOptions();
  },

  methods: {
    /**赋值options*/
    async assignOptions() {
      let res = await this.apiFunc({
        params: {
          pageNum: 1,
          pageSize: 9999
        },
        data: {}
      });
      // 后端响应数据格式不统一兼容处理
      let list = res.data.rows || [];

      this.options = list.map((item, index) => ({
        label: item[this.props.label],
        value: item[this.props.value]
      }))
    }
  }
}
</script>

<style>

</style>