<template>
  <div class="table_card">
    <div class="page_title">交易功能</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="二级交易">
            <el-switch
              v-model="formData.second_market_enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="2"
              inactive-value="1" />
          </el-form-item>
          <!-- 二级交易打开显示 -->
          <template v-if="formData.second_market_enable == '2'">
            <el-form-item label="会员等级浏览权限">
              <gb-select-api 
                v-model="formData.second_market_permit" 
                :api-func="$api.get_memberRank_list" 
                :props="{label: 'levelName', value: 'leveId'}"
                
                multiple collapse-tags />
              <div class="form_control_tip">不设置默认全部会员等级</div>
            </el-form-item>
            <el-form-item label="二级上架间隔时间" prop="second_market_intervals">
              <gb-input-number limit-type="integer" v-model="formData.second_market_intervals" placeholder="请输入二级上架间隔时间" unit="天" />
            </el-form-item>
            <el-form-item label="单次最高加价幅度" prop="max_markup_per_time">
              <gb-input-number v-model="formData.max_markup_per_time" placeholder="请输入单次最高加价幅度" unit="%" />
            </el-form-item>
            <el-form-item label="整体最高加价幅度" prop="max_markup_all">
              <gb-input-number v-model="formData.max_markup_all" placeholder="请输入整体最高加价幅度" unit="%" />
            </el-form-item>
          </template>

          <el-form-item label="藏品转赠">
            <el-switch
              v-model="formData.donate_enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="2"
              inactive-value="1" />
          </el-form-item>
          <!-- 藏品转赠打开显示 -->
          <template v-if="formData.donate_enable == '2'">
            <el-form-item label="转赠送手续费" prop="donate_fee">
              <gb-input-number v-model="formData.donate_fee" placeholder="请输入转赠送手续费" unit="%" />
            </el-form-item>
            <el-form-item label="最低转赠手续费" prop="donate_min_fee">
              <gb-input-number limit-type="integer" v-model="formData.donate_min_fee" placeholder="请输入最低转赠手续费" unit="元" />
            </el-form-item>
            <!-- <el-form-item label="自动审核" prop="auto_audit_day">
              进入审核状态
              <gb-input-number 
                style="width: 200px"
                limit-type="integer" v-model="formData.auto_audit_day" placeholder="请输入" />
              天未审核，自动拒绝
            </el-form-item> -->
          </template>
        </el-form>

        <div>
          <el-button type="primary"
            v-if="!isEdit" 
            :disabled="editDisabled" @click="isEdit = true">立即编辑</el-button>
          <template v-else>
            <el-button type="danger" @click="revoke">撤销</el-button>
            <el-button type="primary" :loading="loading_submit" @click="_setData">确认修改</el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import precisionCalc from '@/utils/precision-calc'

import { GbSelectApi } from '@/components/global'

export default {
  name: 'TransactionFunc',
  components: { GbSelectApi },
  
  props: {
    // 表单数据
    formData: {
      type: Object,
      required: true
    },
    // 禁用编辑
    editDisabled: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      isEdit: false,
      loading_submit: false,
      
      rules: {
        second_market_intervals: [{required: true, message: '二级上架间隔时间不能为空', trigger: 'blur'}],
        max_markup_per_time: [{required: true, message: '单次最高加价幅度不能为空', trigger: 'blur'}],
        max_markup_all: [{required: true, message: '整体最高加价幅度不能为空', trigger: 'blur'}],

        donate_fee: [{required: true, message: '转赠手续费不能为空', trigger: 'blur'}],
        donate_min_fee: [{required: true, message: '最低转赠手续费不能为空', trigger: 'blur'}],
        auto_audit_day: [{required: true, message: '自动审核不能为空', trigger: 'blur'}],
      }
    }
  },

  watch: {
    formData(val) {
      this.setDataCache();
    }
  },

  methods: {
    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_transactionFunc({
              ...this.formData,
              // 接口所需参数格式处理
              second_market_permit: this.formData.second_market_permit.join(','),
              max_markup_per_time : precisionCalc.div(this.formData.max_markup_per_time || 0, 100),
              max_markup_all: precisionCalc.div(this.formData.max_markup_all || 0, 100),
              donate_fee: precisionCalc.div(this.formData.donate_fee || 0, 100),
            });
            this.$message.success('修改成功！');
            this.setDataCache();
            this.isEdit = false;
          }catch(e) {
            this.$emit('update:formData', { ...this.formData_cache });
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }
      })
    },
    /**数据缓存，用于撤销操作*/
    setDataCache() {
      this.formData_cache = { ...this.formData };
    },
    /**撤销*/
    revoke() {
      this.$refs['formRef'].clearValidate();
      
      this.$emit('update:formData', { ...this.formData_cache }); 
      this.isEdit = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>