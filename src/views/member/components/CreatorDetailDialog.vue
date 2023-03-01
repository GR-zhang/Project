<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialogTitle"
    :visible.sync="syncedDialogVisible"

    width="700px"
  >
    <el-form
      v-loading="loading_data"
      
      ref="dialogFormRef" style="padding: 0 20px"
      :model="detailInfo" :rules="rules"
      label-position="left" label-width="110px"
    > 
      <el-form-item label="创作者类型"><span>{{ creatorTypeMap.get(Number.parseInt(detailInfo.designerType))  }}</span></el-form-item>
      <el-form-item label="企业名称"><span>{{ detailInfo.companyName }}</span></el-form-item>
      <el-form-item label="个人身份信息"><span>{{ detailInfo.identityInfo }}</span></el-form-item>
      <el-form-item label="联系方式"><span>{{ detailInfo.contactInfo }}</span></el-form-item>
      <el-form-item label="个人介绍"><span>{{ detailInfo.description }}</span></el-form-item>
      <el-form-item label="作品图片">
        <div 
          v-for="(item, index) in detailInfo.designerExtends" :key="index"
          style="display: inline-block;" class="mr_10"
        >
          <el-image 
            style="width: 100px; height: 100px"
            :src="item.attrVal" fit="cover" 
            :preview-src-list="[item.attrVal]" />
        </div>
      </el-form-item>
      
      <!-- 可以审核显示 -->
      <template v-if="canAudit">
        <el-form-item label="审核" prop="auditState">
          <el-radio-group v-model="detailInfo.auditState">
            <el-radio
              v-for="(item, index) in options_audit" :key="index"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 已拒绝显示 -->
        <el-form-item v-if="detailInfo.auditState == 3" label="拒绝理由" prop="refuseReasons">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入拒绝理由"
            v-model="detailInfo.refuseReasons" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer">
      <template v-if="canAudit">
        <el-button @click="handleCloseDialog" size="medium">取消</el-button>
        <el-button
          :disabled="loading_data"
          :loading="loading_submit"
          type="primary" @click="_handleSubmit" size="medium">确定</el-button>
      </template>
      <el-button v-else @click="syncedDialogVisible = false" size="medium">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { creatorTypeMap, companyAuditMap, generateOptionsByMap } from '@/config'

/**组件说明
 * 创作者详情或审核
*/
export default {
  name: 'CreatorDetailDialog',

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
    id: {
      required: true
    },

    // 可以审核
    canAudit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      creatorTypeMap,
      loading_data: false,
      detailInfo: {},// 创作者详细数据

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

  watch: {
    id(val) {
      this._getDetailInfo();
    }
  },

  methods: {
    /**获取创作者详细信息*/
    async _getDetailInfo() {
      this.loading_data = true;
      try{
        let res = await this.$api.get_creator_detailInfo(this.id);
        this.detailInfo = res.data || {};
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    },

    /**提交*/
    _handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try{
            await this.$api.audit_one_creator({
              designerId: this.detailInfo.designerId,
              auditState: this.detailInfo.auditState,
              refuseReasons: this.detailInfo.auditState == 3 ? this.detailInfo.refuseReasons : undefined
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