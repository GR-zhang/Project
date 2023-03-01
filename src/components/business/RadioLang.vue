<template>
  <div v-if="!hideMultiLangOperate">
    <el-radio-group v-model="syncedValue" size="mini">
      <el-radio-button v-for="item in options" :key="item.locale"
        :label="item.locale">{{ item.label }}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { getLangList, setLocale } from '@/utils/lang-data-hanlde'
const { hideMultiLangOperate } = require('@/settings')

/**多语言单选*/
export default {
  name: 'RadioLang',
  
  props: {
    value: {
      require: true
    }
  },
  data() {
    return {
      options: getLangList(),
      hideMultiLangOperate
    }
  },
  computed: {
    syncedValue: {
      get() {
        return this.value;
      },
      set(val) {
        setLocale(val);
        this.$emit('input', val);
        location.reload();
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>