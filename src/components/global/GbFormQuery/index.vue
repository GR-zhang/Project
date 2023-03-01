<template>
  <el-form
    class="gb-form-query"
    :model="queryParams" inline
    @submit.native.prevent size="mini"
  >
    <el-form-item 
      v-for="(item, index) in queryFormItems" :key="index"
      :label="item.label"
    >
      <template v-if="item.label">
        <template v-if="item.type == 'select'">
          <el-select 
            v-model="queryParams[item.prop]"
            :placeholder="`请选择${item.label}`" clearable
            filterable 
            :multiple="item.multiple" collapse-tags
          >
            <el-option v-for="(_item, index) in item.options" :key="index"
              :label="item.props ? _item[item.props.label] : _item.label"
              :value="item.props ? _item[item.props.value] : _item.value" />
          </el-select>
        </template>
        <template v-else-if="item.type == 'datetime-range'">
          <gb-picker-datetime-range
            v-model="queryParams[item.prop]"
            :collect-params-obj="queryParams"
            :assign-fields="item.assignFields" />
        </template>
        <template v-else-if="item.type == 'gb-select-api'">
          <gb-select-api
            v-model="queryParams[item.prop]"
            :api-func="item.apiFunc"
            :props="item.props" />
        </template>
        
        <template v-else><!--默认 type=='input'-->
          <template v-if="item.inputType == 'id-19-bit'">
            <el-input 
              v-model="queryParams[item.prop]" :placeholder="`请输入${item.label}`" 
              @keyup.enter.native="$emit('text-input-keyup-enter')" clearable
              :maxlength="19" @input="val => queryParams[item.prop] = val.replace(/\D/g, '')" />
          </template>
          <template v-else>
            <el-input type="text" v-model="queryParams[item.prop]"
            :placeholder="`请输入${item.label}`" clearable
            @keyup.enter.native="$emit('text-input-keyup-enter')" />
          </template>
        </template>
      </template>

      <!-- input组合搜索框：左边下拉框字段，右边搜索关键字 -->
      <template v-else>
        <div style="display: flex;">
          <el-select 
            v-model="syncedKeywordField" placeholder="请选择"
            style="width: 35%;margin-right: 5px;"
            @change="val => handleKeywordFieldChange(val, item.dropDownBoxOptions)"
          >
            <el-option
              v-for="item in item.dropDownBoxOptions" :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            style="flex: 1;"
            v-model="syncedKeyword" placeholder="请输入关键字" clearable
            @change="handleKeywordChange"
            @keyup.enter.native="$emit('text-input-keyup-enter')" />
        </div>
      </template>
    </el-form-item>

    <el-form-item v-if="!hiddenOperateBtn">
      <el-button icon="el-icon-search" type="primary" @click="$emit('search-btn-click')">搜索</el-button>
      <el-button icon="el-icon-refresh" type="info" @click="$emit('reset-btn-click')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import GbPickerDatetimeRange from '../GbPickerDatetimeRange'
import GbSelectApi from '../GbSelectApi'

/** GbFormQuery组件说明
 * 使用queryFormItems来定制查询表单，queryParams收集查询参数
*/
export default {
  name: 'GbFormQuery',
  components: {
    GbPickerDatetimeRange,
    GbSelectApi
  },

  props: {
    // v-for循环表单项
    queryFormItems: {
      type: Array,
      required: true,
    },
    // 查询参数
    queryParams: {
      type: Object,
      required: true
    },
    // ===== 特殊情况下 =====
    hiddenOperateBtn: {
      type: Boolean,
      default: false
    },

    // 关键字字段名称
    keywordField: {
      type: String
    },
    // 关键字值
    keyword: {
      type: String
    }
  },
  computed: {
    syncedKeywordField: {
      get() {
        return this.keywordField
      },
      set(val) {
        this.$emit('update:keywordField', val)
      }
    },
    syncedKeyword: {
      get() {
        return this.keyword
      },
      set(val) {
        this.$emit('update:keyword', val)
      }
    }
  },

  methods: {
    /**关键字字段修改处理*/
    handleKeywordFieldChange(val, options) {
      //ps: 每一次下拉框选中，要赋值新的查询字段，同时清空旧的查询字段值
      options.forEach(item => {
        if(val === item.value) {
          this.queryParams[item.value] = this.keyword
        }else {
          this.queryParams[item.value] = undefined;
        }   
      })
    },
    /**关键字值修改处理*/
    async handleKeywordChange(val) {
      this.queryParams[this.keywordField] = val;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>