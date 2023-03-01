<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '修改') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="650px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="80px"
    > 
      <el-form-item label="序号" prop="leveId">
        <gb-input-number
          :disabled="dialogType == 'edit'"
          limit-type="integer" v-model="rowData.leveId" placeholder="请输入序号" />
        <div class="form_control_tip">注意：序号越大等级越高</div>
      </el-form-item>
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="rowData.levelName" placeholder="请输入等级名称" />
      </el-form-item>
      <el-form-item label="升级条件" prop="selConditions">
        <el-checkbox-group v-model="rowData.selConditions">
          <el-checkbox :label="1">
            消费金额总计达到 <gb-input-number style="width: 130px" v-model="rowData.upgrade.twoTotalConsumption" size="mini" /> 元
          </el-checkbox>
          <br/>
          <el-checkbox :label="2">
            直推会员人数达到 <gb-input-number style="width: 130px" limit-type="integer" v-model="rowData.upgrade.pushStraightMember" size="mini" /> 人
          </el-checkbox>
          <br/>
          <el-checkbox :label="3">
            伞下团队人数(不含自己)达到 <gb-input-number style="width: 130px" limit-type="integer" v-model="rowData.upgrade.umbrellaTeam" size="mini" /> 人
          </el-checkbox>
          <br/>
          <el-checkbox :label="4">
            直推团队消费总额达到 <gb-input-number style="width: 130px" v-model="rowData.upgrade.directPushNum" size="mini" /> 元
          </el-checkbox>
          <br/>
          <el-checkbox :label="5">
            伞下团队人数(不含自己)消费金额总计达到 <gb-input-number style="width: 130px" v-model="rowData.upgrade.umbrellaTeamSum" size="mini" /> 元
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="一级交易手续费" prop="transFee" label-width="120px">
        <gb-input-number limit-type="percentage" v-model="rowData.transFee" placeholder="请输入一级交易手续费" unit="%" /> 
      </el-form-item>
      <el-form-item label="二级交易手续费" prop="transFee2" label-width="120px">
        <gb-input-number limit-type="percentage" v-model="rowData.transFee2" placeholder="请输入二级交易手续费" unit="%" /> 
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
export default {
  name: 'MemberRankSetDialog',

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
    // 校验升级条件
    var checkUpgradeCondition = (rule, value, callback) => {
      if(value.includes(1)) {
        if(!this.rowData.upgrade.twoTotalConsumption) {
          callback(new Error('该项选择后对应参数不能为空或0'));
        }
      }
      if(value.includes(2)) {
        if(!this.rowData.upgrade.pushStraightMember) {
          callback(new Error('该项选择后对应参数不能为空或0'));
        }
      }
      if(value.includes(3)) {
        if(!this.rowData.upgrade.umbrellaTeam) {
          callback(new Error('该项选择后对应参数不能为空或0'));
        }
      }
      if(value.includes(4)) {
        if(!this.rowData.upgrade.directPushNum) {
          callback(new Error('该项选择后对应参数不能为空或0'));
        }
      }
      if(value.includes(5)) {
        if(!this.rowData.upgrade.umbrellaTeamSum) {
          callback(new Error('该项选择后对应参数不能为空或0'));
        }
      }

      callback();
    };

    return {
      rules: {
        leveId: [{required: true, message: '序号不能为空', trigger: 'blur'}],
        levelName: [{required: true, message: '等级名称不能为空', trigger: 'blur'}],
        selConditions: [
          {required: true, message: '升级条件不能为空', trigger: 'blur'},
          {validator: checkUpgradeCondition, trigger: 'change'}
        ],
        transFee: [{required: true, message: '一级交易手续费不能为空', trigger: 'blur'}],
        transFee2: [{required: true, message: '二级交易手续费不能为空', trigger: 'blur'}]
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