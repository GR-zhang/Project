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
      <el-form-item label="关联商品" prop="colId">
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

        <!-- 对话框【藏品选择】 -->
        <collection-select-dialog
          :dialog-visible.sync="dialogVisible_nested"
          dialog-title="藏品选择"
          :active-id="rowData.colId"
          @sel-one="(row) => {
            rowData.colId = row.colId;
            rowData.colName = row.colName;
            $refs.dialogFormRef.validateField('colId');
          }"
          
          :extraQueryParams="{preSale: 1}" />
      </el-form-item>
      <el-form-item label="优先购时间" prop="earlyTime">
        <gb-input-number limit-type="integer" v-model="rowData.earlyTime" unit="分" />
        <div class="form_control_tip">基于预售开始时间，提前多少分钟优先购买</div>
      </el-form-item>
      <el-form-item label="优先购条件">
        <el-radio-group v-model="rowData.activityMode">
          <el-radio
            v-for="item in options_buyFirstCondition" :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 1" label="会员等级" prop="typeIds_rank" :key="1">
        <gb-select-api 
          v-model="rowData.typeIds_rank" placeholder="请选择会员等级"
          multiple collapse-tags filterable 
          :apiFunc="$api.get_memberRank_list" :props="{label: 'levelName', value: 'leveId'}" />
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 2" label="白名单" prop="typeIds_whitelist" :key="2">
        <gb-select-api 
          v-model="rowData.typeIds_whitelist" placeholder="请选择白名单"
          multiple collapse-tags filterable
          :apiFunc="$api.get_whitelist_list" :props="{label: 'name', value: 'id'}"  />
      </el-form-item>
      <el-form-item label="状态" prop="activityStatus">
        <el-radio-group v-model="rowData.activityStatus">
          <el-radio
            v-for="(item, index) in options_switchStatus" :key="index"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
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
import { switchStatusMap, buyFirstConditionMap, generateOptionsByMap } from '@/config'

import { GbSelectApi } from '@/components/global'
import { CollectionSelectDialog } from '@/components/business'

export default {
  name: 'BuyFirstAddOrEditDialog',
  components: { GbSelectApi, CollectionSelectDialog },

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
      options_buyFirstCondition: generateOptionsByMap(buyFirstConditionMap),
      options_switchStatus: generateOptionsByMap(switchStatusMap),
      rules: {
        colId: [{required: true, message: '关联商品不能为空', trigger: 'change'}],
        earlyTime: [{required: true, message: '优先购时间不能为空', trigger: 'blur'}],
        typeIds_rank: [{required: true, message: '会员等级不能为空', trigger: 'change'}],
        typeIds_whitelist: [{required: true, message: '白名单不能为空', trigger: 'change'}],
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