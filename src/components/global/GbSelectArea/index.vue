<template>
  <div class="gb-select-area">
    <el-cascader
      ref="cascaderRef"
      v-model="syncedValue" :options="regionData"
      clearable @change="handleChange" />
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'

/** GbSelectArea组件说明
 * 省市区选择器
*/
export default {
  name: 'GbSelectArea',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 收集参数对象
    collectParamsObj: {
      type: Object,
      required: true
    },
    // 赋值属性数组[[省编号，市编号, 区编号], [省名称，市名称, 区名称]]
    assignFields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      regionData
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
    handleChange(vals) {
      if(vals && vals.length != 0) {
        // 赋值编号
        this.collectParamsObj[this.assignFields[0][0]] = vals[0];
        this.collectParamsObj[this.assignFields[0][1]] = vals[1];
        this.collectParamsObj[this.assignFields[0][2]] = vals[2];

        // 取出名称
        let pathLabels = this.$refs['cascaderRef'].getCheckedNodes()[0].pathLabels;
        // 赋值名称
        if(this.assignFields[1]) {
          this.collectParamsObj[this.assignFields[1][0]] = pathLabels[0];
          this.collectParamsObj[this.assignFields[1][1]] = pathLabels[1];
          this.collectParamsObj[this.assignFields[1][2]] = pathLabels[2];
        }
      }else {
        this.collectParamsObj[this.assignFields[0][0]] = undefined;
        this.collectParamsObj[this.assignFields[0][1]] = undefined;
        this.collectParamsObj[this.assignFields[0][2]] = undefined;

        if(this.assignFields[1]) {
          this.collectParamsObj[this.assignFields[1][0]] = undefined;
          this.collectParamsObj[this.assignFields[1][1]] = undefined;
          this.collectParamsObj[this.assignFields[1][2]] = undefined;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>