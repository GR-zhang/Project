<template>
  <el-select
    class="select-express-company"
    v-model="syncedValue"
    filterable clearable
    placeholder="请选择发货公司"
  >
    <el-option
      v-for="item in options" :key="item.value"
      :label="item.label" :value="item.value" />
  </el-select>
</template>

<script>
/**快递公司下拉选择框*/
export default {
  name: 'SelectExpressCompany',

  props: {
    // 控件值
    value: {
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
      let res = await this.$api.get_expressCompany_list();

      this.options = (res.data || []).map((item, index) => ({
        label: item.companyName,
        value: item.companyCode
      }))
    }
  }
}
</script>

<style>

</style>