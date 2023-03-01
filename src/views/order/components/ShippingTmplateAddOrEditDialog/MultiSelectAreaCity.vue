<template>
  <div class="multi-select-area-city">
    <el-cascader
      :options="options"
      v-model="syncedValue"
      :props="{ multiple: true }"
      collapse-tags :disabled="disabled" />
  </div>
</template>

<script>
import areaData from '@/assets/area.json'

export default {
  name: 'MultiSelectAreaCity',

  props: {
    value: {
      type: Array,
      required: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: areaData,
    }
  },
  computed: {
    syncedValue: {
      get() {
        return this.value;
      },
      set(vals) {
        this.$emit('input', vals)
      }
    }
  }
}
</script>