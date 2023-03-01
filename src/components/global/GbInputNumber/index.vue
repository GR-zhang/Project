<template>
  <el-input
    class="gb-input-number"
    v-bind="$attrs"

    v-model="syncedValue" clearable
    @input="limitInput"
    @blur="typeConversion"
    @change="$emit('transfer-change')"
  >
    <el-button v-if="unit" slot="append">{{ unit }}</el-button>
  </el-input>
</template>

<script>
/**GbInputNumber组件说明
 * 限制只能输入数字，v-model绑定值最终转化为 数字类型
*/
export default {
  name: 'GbInputNumber',
  inheritAttrs: false,

  props: {
    // 控件值
    value: {
      require: true
    },
    // 单位
    unit: {
      type: String
    },
    // 限制类型
    limitType: {
      type: String,
      default: 'float',
      validator(val) {
        let flag = ['float', 'integer', 'percentage'].includes(val);
        !flag && console.warn("prop[limitType]只能是['float', 'integer', 'percentage']中类型之一");
        return flag;
      }
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
  methods: {
    /**限制输入*/
    limitInput(val) {
      if(this.limitType == 'float') {
        this.syncedValue = val.replace(/[^\d.]/g, '')
          .replace(/^0{2}$/g, '0').replace(/^\./g, '')// 首0仅一个，且不能是.
          .replace(/(^0[\d]*)$/g, '0')// 防止 00121323
          .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')//小数点一个
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 保留2位小数
      }else if(this.limitType == 'integer') {
        this.syncedValue = val.replace(/\D/g, '')
          .replace(/(^0[\d]*)$/g, '0')// 防止 00121323
      }else if(this.limitType == 'percentage') {
        this.syncedValue = val.replace(/[^\d.]/g, '')
          .replace(/^0{2}$/g, '0').replace(/^\./g, '')// 首0仅一个，且不能是.
          .replace(/(^0[\d]*)$/g, '0')// 防止 00121323
          .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')//小数点一个
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')//保留2位小数

          .replace(/^[1-9]\d{2}$/, '100')// 数字超过100，赋值成最大值100
          .replace(/^100\d*.$/, '100')// 超过100之后不给再输入值
      }
    },
    /**string => number*/
    typeConversion() {
      if(!this.syncedValue) {
        this.syncedValue = undefined
      }else {
        this.syncedValue = Number.parseFloat(this.syncedValue);
      }

      // 特殊情况下会使用到
      this.$emit('transfer-blur');
    }
  }
}
</script>

<style lang="sass" scoped>

</style>>

</style>