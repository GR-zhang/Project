<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="650px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="100px"
    > 
      <el-form-item label="轮播图" prop="imgUrl">
        <uploader-single-file :file-url.sync="rowData.imgUrl" ratio="690*388px"  />
      </el-form-item>

      <el-form-item label="跳转类型">
        <el-radio-group v-model="rowData.jumpType">
          <el-radio
            v-for="(item, index) in options_swiperJumpType" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="rowData.jumpType == 1" label="跳转藏品" prop="colId">
        <el-button
          size="mini" type="info" 
          @click="dialogVisible_nested = true;">选择</el-button>
        <div>
          藏品名称:&nbsp;&nbsp;
          <el-tag type="danger" effect="plain">{{ rowData.colName ? rowData.colName : '暂未选择' }}</el-tag>
        </div>
        <div>
          藏品ID:&nbsp;&nbsp;
          <el-tag type="danger" effect="plain">{{ rowData.colId ? rowData.colId : '暂未选择' }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item v-if="rowData.jumpType == 2" label="链接地址" prop="url">
        <el-input v-model="rowData.url" placeholder="请输入链接地址" clearable />
      </el-form-item>

      <el-form-item label="权重" prop="weight">
        <gb-input-number limit-type="integer" v-model="rowData.weight" placeholder="请输入序号" />
        <div class="form_control_tip">权重越大,排序越前</div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="rowData.status">
          <el-radio
            v-for="(item, index) in options_switchStatus" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- 对话框【藏品选择】 -->
    <collection-select-dialog
      :dialog-visible.sync="dialogVisible_nested"
      dialog-title="藏品选择"
      :active-id="rowData.colId"
      @sel-one="(row) => {
        rowData.colId = row.colId;
        rowData.colName = row.colName;
        $refs.dialogFormRef.validateField('colId');
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
import { switchStatusMap, swiperJumpTypeMap, generateOptionsByMap } from '@/config'

import { CollectionSelectDialog } from '@/components/business'
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'

export default {
  name: 'SwiperAddOrEditDialog',
  components: { CollectionSelectDialog, UploaderSingleFile },

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
      options_swiperJumpType: generateOptionsByMap(swiperJumpTypeMap),
      options_switchStatus: generateOptionsByMap(switchStatusMap),
      rules: {
        imgUrl: [{required: true, message: '轮播图不能为空', trigger: 'blur'}],
        colId: [{required: true, message: '跳转藏品不能为空', trigger: 'blur'}],
        url: [
          {required: true, message: '链接地址不能为空', trigger: 'blur'},
          {
            pattern: /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/,
            message: '请输入正确的链接地址',
            trigger: 'blur'
          }
        ],
        weight: [{required: true, message: '权重不能为空', trigger: 'blur'}],
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