<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="550px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="100px"
    > 
      <el-form-item label="绑定会员" prop="uid">
        <el-button
          :disabled="dialogType == 'edit'"
          size="mini" type="info" 
          @click="dialogVisible_nested = true;">选择</el-button>
        <div>
          会员昵称:&nbsp;&nbsp;
          <el-tag type="danger" effect="plain">{{ rowData.nickName ? rowData.nickName : '暂未选择' }}</el-tag>
        </div>
        <div>
          会员ID:&nbsp;&nbsp;
          <el-tag type="danger" effect="plain">{{ rowData.uid ? rowData.uid : '暂未选择' }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="创作者类型" prop="designerType">
        <el-select
          disabled 
          v-model="rowData.designerType" placeholder="请选择创作者类型"
        >
          <el-option
            v-for="(item, index) in options_creatorType" :key="index"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="designerStatus">
        <el-radio-group v-model="rowData.designerStatus">
          <el-radio
            v-for="(item, index) in options_switchStatus" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推荐创作者" prop="recommend">
        <el-radio-group v-model="rowData.recommend">
          <el-radio
            v-for="(item, index) in options_isRecomCreator" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 对话框【会员选择】 -->
    <memeber-select-dialog
      :dialog-visible.sync="dialogVisible_nested"
      dialog-title="会员选择"
      :active-id="rowData.uid"
      @sel-one="(row) => {
        rowData.uid = row.uid;
        rowData.nickName = row.nickName;
        $refs.dialogFormRef.validateField('uid');
      }" />

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { switchStatusMap, creatorTypeMap, isRecomCreatorMap, generateOptionsByMap } from '@/config'

import { MemeberSelectDialog } from '@/components/business'

export default {
  name: 'CreatorAddOrEditDialog',
  components: {MemeberSelectDialog},

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
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      options_creatorType: generateOptionsByMap(creatorTypeMap),
      options_switchStatus: generateOptionsByMap(switchStatusMap),
      options_isRecomCreator: generateOptionsByMap(isRecomCreatorMap),
      rules: {
        uid: [{required: true, message: '绑定会员不能为空', trigger: 'blur'}]
      },
      // 内嵌对话框
      dialogVisible_nested: false,
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

<style lang="scss">

</style>