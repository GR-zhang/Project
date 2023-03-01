<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="1000px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="80px"
    > 
      <el-form-item label="模板名称" prop="shippingName">
        <el-input v-model="rowData.shippingName" placeholder="请输入模板名称" clearable />
      </el-form-item>
      <el-form-item label="计费方式" prop="method">
        <el-select v-model="rowData.method" placeholder="请选择计费方式" clearable>
          <el-option
            v-for="(item, index) in options_billingMethod" :key="index"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="区域选择及运费" prop="shippingRuleVOS">
        <regional-shipping-table 
          :table-data.sync="rowData.shippingRuleVOS"
          :billingMethod="rowData.method"
          @verify="$refs['dialogFormRef'].validate('shippingRuleVOS')" />
      </el-form-item>
      <el-form-item label="权重" prop="weigh">
        <gb-input-number limit-type="integer" v-model="rowData.weigh" placeholder="请输入权重" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { billingMethodMap, generateOptionsByMap } from '@/config'

import RegionalShippingTable from './RegionalShippingTable'

export default {
  name: 'ShippingTmplateAddOrEditDialog',
  components: {RegionalShippingTable},

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框类型
    dialogType: {
      type: String,
      required: true
    },
      // 对话框主题
      dialogTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    // 表单数据
    rowData: {
      type: Object,
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    },
  },
  data() {
    var checkShippingRuleVOS = (rule, value, callback) => {    
      value.some(item => item.isEdit) ? callback(new Error('表格新加行数据需要 确定 才生效')) : callback();    
    };

    return {
      options_billingMethod: generateOptionsByMap(billingMethodMap),
      rules: {
        shippingName: [{required: true, message: '模板名称不能为空', trigger: 'blur'}],
        method: [{required: true, message: '计费方式不能为空', trigger: 'change'}],
        shippingRuleVOS: [
          {required: true, message: '区域选择及运费不能为空', trigger: 'change'},
          {validator: checkShippingRuleVOS, trigger: 'change'}
        ],
        weigh: [{required: true, message: '权重不能为空', trigger: 'blur'}],
      }
    }
  },
  computed: {
    syncedDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      }
    },
    syncedSubmitLoading: {
      get() {
        return this.submitLoading;
      },
      set(newVal) {
        this.$emit('update:submitLoading', newVal);
      }
    },
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

<style lang="scss" scoped>

</style>