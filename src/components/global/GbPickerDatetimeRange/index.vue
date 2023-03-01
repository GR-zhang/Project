<template>
  <el-date-picker
    class="gb-picker-datetime-range"
    v-bind="$attrs"
    
    v-model="syncedValue"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    :default-time="['00:00:00', '23:59:59']"
    @change="handleChange" />
</template>

<script>

/**GbPickerDatetimeRange组件说明
 * 后端接口需要的是两个单独的日期时间值，而非数组
 * 该组件封装了 startTime 与 endTime 字段赋值
*/
export default {
  name: 'GbPickerDatetimeRange',
  inheritAttrs: false,
  
  props: {
    // 控件值
    value: {
      type: Array,
      default: () => []
    },
    // 收集参数对象
    collectParamsObj: {
      type: Object,
      required: true
    },
    // 赋值属性数组, 格式[开始日期时间字段名，结束时间字段名]
    assignFields: {
      type: Array,
      required: true
    }
  },
  computed: {
    syncedValue: {
      get() {
        return this.value;
      },
      set(vals) {
        this.$emit('input', vals);
      }
    }
  },
  
  methods: {
    /**选择日期时间时做赋值处理
     * ps: 重置操作时，父组件将syncedValue设置为[],不触发该事件。需要手动把startTime,endTime参数重置
     * */
    handleChange(vals) {
      if(vals && vals.length != 0) {
        // 时间戳单位后端需要s
        this.collectParamsObj[this.assignFields[0]] = new Date(vals[0]).getTime() / 1000;
        this.collectParamsObj[this.assignFields[1]] = new Date(vals[1]).getTime() / 1000;
      }else {
        this.collectParamsObj[this.assignFields[0]] = undefined;
        this.collectParamsObj[this.assignFields[1]] = undefined;
      }
    }
  }
}
</script>

<style>

</style>