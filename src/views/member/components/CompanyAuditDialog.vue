<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="740px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="140px"
    > 
      <el-form-item v-if="isDetail" label="审核状态">
        <MultiTagDisplay :value="rowData.applyStatus" :multiTagInfo="multiTagInfo.auditStatus" />
      </el-form-item>
      <el-form-item label="第三方审核状态">
        <MultiTagDisplay :value="rowData.aiAuditStatus" :multiTagInfo="multiTagInfo.thirdPartyAuditStatus" />
      </el-form-item>
      <el-form-item label="企业名称">{{  rowData.companyName }}</el-form-item>
      <el-form-item label="联系人姓名">{{ rowData.linkmanName }}</el-form-item>
      <el-form-item label="手机号码">{{ rowData.linkmanPhone }}</el-form-item>
      <el-form-item label="营业执照">
        <el-image 
          style="width: 150px; height: 100px"
          :src="rowData.licenceUrl" fit="contain" 
          :preview-src-list="[rowData.licenceUrl]" />
      </el-form-item>
      <el-form-item label="经营范围">{{ rowData.businessScope }}</el-form-item>
      <el-form-item label="法人姓名">{{ rowData.legalPersonName }}</el-form-item>
      <el-form-item label="法人手机号码">{{ rowData.legalMp }}</el-form-item>
      <el-form-item label="法人姓名">{{ rowData.legalPersonName }}</el-form-item>
      <el-form-item label="身份证图片">
        <el-image
          v-for="(item, index) in rowData.identityPics" :key="index" 
          style="width: 150px; height: 100px; margin-right: 10px;"
          :src="item" fit="contain" 
          :preview-src-list="[item]" />
        <div>有效期: {{ rowData.legalCertIdExpires * 1000 | parseTime }}</div>
      </el-form-item>
      <el-form-item label="统一社会信用码">
        {{  rowData.socialCreditCode }}
        <div>有效期: {{ rowData.socialCreditCodeExpires * 1000 | parseTime }}</div>
      </el-form-item>
      <el-form-item label="开户行名称">{{ rowData.bankName }}</el-form-item>
      <el-form-item label="开户户名">{{ rowData.cardName }}</el-form-item>
      <el-form-item label="银行卡号">{{ rowData.cardNo }}</el-form-item>
      <el-form-item label="银行预留手机号码">{{ rowData.cardPhone }}</el-form-item>
      <el-form-item label="银行许可证件照">
        <el-image 
          style="width: 150px; height: 100px"
          :src="rowData.bankOpeningPermit" fit="contain" 
          :preview-src-list="[rowData.bankOpeningPermit]" />
      </el-form-item>

      <template v-if="!isDetail">
        <el-form-item label="审核" prop="auditState">
          <el-radio-group v-model="rowData.auditState">
            <el-radio
              v-for="(item, index) in options_audit" :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 已拒绝显示 -->
        <el-form-item v-if="rowData.auditState == 3" label="拒绝理由" prop="refuseReasons">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入拒绝理由"
            v-model="rowData.refuseReasons" />
        </el-form-item>
      </template>
    </el-form>

    <span slot="footer">
      <el-button v-if="isDetail" @click="handleCloseDialog" size="medium">关闭</el-button>
      <template v-else>
        <el-button @click="handleCloseDialog" size="medium">取消</el-button>
        <el-button
          :loading="loading_submit"
          type="primary" @click="_handleSubmit" size="medium">确定</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import { companyAuditMap, generateOptionsByMap, multiTagInfo } from '@/config'

import MultiTagDisplay from '@/components/global/GbTableDisplay/MultiTagDisplay.vue'

export default {
  name: 'CompanyAuditDialog',
  components: { MultiTagDisplay },

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
    },

    // 是否是详情(详情 || 审核)
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiTagInfo,
      loading_submit: false,
      options_audit: generateOptionsByMap(companyAuditMap),
      rules: {
        auditState: [{required: true, message: '审核不能为空', trigger: 'change'}],
        refuseReasons: [{required: true, message: '拒绝理由不能为空', trigger: 'change'}]
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
            await this.$api.audit_one_company({
              id: this.rowData.id,
              auditState: this.rowData.auditState,
              refuseReasons: this.rowData.auditState == 3 ? this.rowData.refuseReasons : undefined
            })
            this.$message.success('审核成功！');
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