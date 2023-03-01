<template>
  <div class="table_card">
    <div class="page_title">竞拍手续费</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="120px"
          :disabled="!isEdit"
        >
          <el-form-item label="英式竞拍" prop="britishAuctionFee">
            <gb-input-number v-model="formData.britishAuctionFee" placeholder="请输入" unit="%" />
          </el-form-item>
          <el-form-item label="荷兰式竞拍" prop="dutchAuctionFee">
            <gb-input-number v-model="formData.dutchAuctionFee" placeholder="请输入" unit="%" />
          </el-form-item>
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

export default {
  name: 'HandlingFree',
  
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
        britishAuctionFee: [{required: true, message: '英式竞拍手续费不能为空', trigger: 'blur'}],
        dutchAuctionFee: [{required: true, message: '荷兰式竞拍手续费不能为空', trigger: 'blur'}]
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
            await this.$api.set_auctionHandlingFree({
              britishAuctionFee: precisionCalc.div(this.formData.britishAuctionFee || 0, 100),
              dutchAuctionFee: precisionCalc.div(this.formData.dutchAuctionFee || 0, 100)
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