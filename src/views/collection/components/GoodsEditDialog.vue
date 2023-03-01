<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="700px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="95px"
    > 
      <el-form-item label="藏品名称">{{  rowData.colName }}</el-form-item>
      <el-form-item label="市场类型">{{ marketTypeMap.get(Number.parseInt(rowData.marketType)) }}</el-form-item>
      <el-form-item label="商品图片">
        <el-image 
          style="width: 200px; height: 150px"
          :src="rowData.thumb" fit="contain" 
          :preview-src-list="[rowData.thumb]" />
      </el-form-item>
      <el-form-item label="商品状态" prop="auditState">
        <el-radio-group v-model="rowData.auditState">
          <el-radio
            v-for="(item, index) in options_audit" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 下架显示 -->
      <el-form-item v-if="rowData.auditState == 4" label="下架理由" prop="refuseReasons">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入下架理由"
          v-model="rowData.refuseReasons" />
      </el-form-item>
      <el-form-item label="销售价格" prop="salePrice">
        <gb-input-number v-model="rowData.salePrice" placeholder="请输入销售价格" unit="元" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="loading_submit"
        type="primary" @click="_handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { goodsAuditMap, marketTypeMap, generateOptionsByMap } from '@/config'

export default {
  name: 'GoodsEditDialog',

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框标题
    dialogTitle: {
      type: String,
      default: '[ 标题 ]'
    },
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      marketTypeMap,
      loading_submit: false,
      options_audit: generateOptionsByMap(goodsAuditMap),
      rules: {
        auditState: [{required: true, message: '审核不能为空', trigger: 'change'}],
        refuseReasons: [{required: true, message: '拒绝理由不能为空', trigger: 'change'}],
        salePrice: [{required: true, message: '销售价格不能为空', trigger: 'change'}]
      }
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
    }
  },

  methods: {
    /**提交*/
    _handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try{
            await this.$api.edit_one_goods({
              goodsId: this.rowData.goodsId,
              listedStatus: this.rowData.auditState,
              listedReason: this.rowData.auditState == 4 ? this.rowData.refuseReasons : undefined,
              salePrice: this.rowData.salePrice
            })
            this.$message.success('编辑成功！');
            this.syncedDialogVisible = false;
            this.$emit('refresh');
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false;
          }
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

<style lang="scss">

</style>