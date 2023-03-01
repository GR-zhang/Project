<template>
  <el-dialog
    v-bind="$attrs"

    :close-on-click-modal="false"
    :title="finnalTitle"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog">

    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" :label-width="formLabelWidth"
    >
      <el-row :gutter="20">
        <el-col 
          :span="item.colSpan ? item.colSpan : (doubleCol ? 12 : 24)"
          v-for="(item, index) in modalFormItems" :key="index"
        >
          <el-form-item
            :label="`${item.label}`" :prop="item.prop"
            :label-width="item.labelWidth"
          >
            <template v-if="item.type == 'select'">
              <el-select
                v-model="rowData[item.prop]"
                :placeholder="`请选择${item.label}`" clearable
                filterable
                :multiple="item.multiple" collapse-tags
              >
                <el-option
                  v-for="(_item, _index) in item.options" :key="_index"
                  :label="_item.label" :value="_item.value" :disabled="_item.disabled" />
              </el-select>
            </template>
            <template v-else-if="item.type == 'radio'">
              <el-radio-group v-model="rowData[item.prop]">
                <el-radio
                  v-for="(_item, _index) in item.options" :key="_index"
                  :label="_item.value"
                >{{ _item.label }}</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="item.type == 'switch'">
              <el-switch
                v-model="rowData[item.prop]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="item.switchVal ? item.switchVal[0] : 1"
                :inactive-value="item.switchVal ? item.switchVal[1]: 2"/>
              </template>
            <template v-else-if="item.type == 'textarea'">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4}"
                :placeholder="`请输入${item.label}`"
                v-model="rowData[item.prop]">
              </el-input>
            </template>
            <template v-else-if="item.type == 'gb-input-number'">
              <gb-input-number
                :limit-type="item.limitType ? item.limitType : 'float'" v-model="rowData[item.prop]"
                :placeholder="`请输入${item.label}`" :unit="item.unit" />
            </template>

            <!-- gb-select-api -->
            <template v-else-if="item.type == 'gb-select-api'">
              <gb-select-api
                v-model="rowData[item.prop]"
                :placeholder="`请输入关键字`"
                :api-func="item.apiFunc"
                :props="item.props" />
            </template>
            
            <!-- 单图片上传 -->
            <template v-else-if="item.type == 'single-img-upload'">
              <uploader-single-file
                :file-url.sync="rowData[item.prop]"
                :upload-area-size="item.uploadAreaSize ? item.uploadAreaSize : {width: '298px', height: '200px'}"
                :iconSize="item.iconSize ? item.iconSize : 'medium'"
                :ratio="item.ratio ? item.ratio : undefined"
                :img-fit="item.imgFit ? item.imgFit : 'contain'"
                :disabled="item.disabled ? item.disabled : false"
                @verify="$refs['dialogFormRef'].validateField(item.prop)" />
            </template>
            <!-- 富文本 -->
            <template v-else-if="item.type == 'rich-text'">
              <!-- v-if="dialogVisible" 确保每次都销毁重建组件 -->
              <tinymce 
                v-if="dialogVisible"
                v-model="rowData[item.prop]" @verify="$refs['dialogFormRef'].validateField(item.prop)" />
            </template>
            <!-- 表格数据 -->
            <template v-else-if="item.type == 'edit-table'">
              <edit-table
                :parent-id="rowData[item.parentIdField]"
                :table-data.sync="rowData[item.prop]"
                :row-data="rowData"
                @verify="$refs.dialogFormRef.validateField(item.prop)" />
            </template>

            <!-- 业务组件 -->
            <template v-else-if="item.type == 'creater-select'">
              <createrSelect
                v-model="rowData[item.prop]" 
                :tag-name.sync="rowData[item.tagNameField]"
                @validate="$refs['dialogFormRef'].validateField(item.prop)"/>
            </template>
            <template v-else-if="item.type == 'select-express-company'">
              <select-express-company v-model="rowData[item.prop]" />
            </template>

            <template v-else><!-- 默认input控件 -->
              <el-input 
                :type="item.isPwdInput ? 'password' : 'text'" :show-password="item.isPwdInput"
                v-model="rowData[item.prop]" 
                :placeholder="`请输入${item.label}`" 
                clearable :disabled="item.disabled" />
            </template>

            <div class="form_control_tip">{{ item.tip }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading"
        type="primary" @click="handleSubmit" size="medium">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  EditTable,
  UploaderSingleFile,
} from './components'
import GbInputNumber from '../GbInputNumber'
import GbSelectApi from '../GbSelectApi'
import Tinymce from '@/components/Tinymce'
// 业务组件
import { CreaterSelect, SelectExpressCompany } from '@/components/business'

import { generateFormRulesByModalFormItems } from './utils/form-validate'

export default {
  name: 'GbAddAndEditDialog',
  components: {
    EditTable,
    UploaderSingleFile,
    GbInputNumber,
    GbSelectApi,
    Tinymce,

    // 业务组件
    CreaterSelect,
    SelectExpressCompany
  },
  inheritAttrs: false,
  
  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框类型，决定对话框标题
    dialogType: {
      type: String,
      // required: true
    },
      // 对话框主题
      dialogTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    // 对话框自定义标题，优先级大于对话框主题
    dialogCustomTitle: {
      type: String,
    },
    // 对话框v-for循环表单项
    modalFormItems: {
      type: Array,
      required: true
    },
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    },

    //=============不常用=============
    // 表单label-width
    formLabelWidth: {
      type: String,
      default: '90px'
    },
    // 双列展示
    doubleCol: {
      type: Boolean,
      default: false
    },
    // 确认按钮文本，传入覆盖 确认
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  data() {
    return {
      // 表单验证规则
      rules: {},

      // 视频limit.accept
      // videoFormat: FmHelper.videoFormat
    }
  },
  computed: {
    // 双向数据绑定dialogVisible
    syncedDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      }
    },
    // 双向数据绑定submitLoading
    syncedSubmitLoading: {
      get() {
        return this.submitLoading;
      },
      set(newVal) {
        this.$emit('update:submitLoading', newVal);
      }
    },
    // 最终标题
    finnalTitle() {
      if(this.dialogCustomTitle) {
        return this.dialogCustomTitle;
      };
      return `${this.dialogType == 'add' ? '添加' : '编辑'}${this.dialogTopic}`;
    }
  },

  watch: {
    modalFormItems: {
      handler: function () { this.rules = generateFormRulesByModalFormItems(this.modalFormItems); },
      immediate: true
    }
  },

  methods: {
    // 提交
    handleSubmit() {
      this.$refs.dialogFormRef.validate(valid => {
        if(valid) {
          this.syncedSubmitLoading = true;
          this.$emit('submit');
        }else {
          return false;
        }
      })
    },
    // 关闭对话框
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();

      this.syncedDialogVisible = false;
    }
  }
}
</script>

<style>

</style>