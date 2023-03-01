<template>
  <div class="after-sale-set-container">
    <div class="table_card">
      <div class="page_title">售后设置</div>
      <el-row>
        <el-col :md="24" :lg="12">
          <el-form 
            ref="formRef"
            :model="setParams" :rules="rules"
            label-position="left" label-width="120px"
            :disabled="!isEdit"
          >
            <el-form-item label="平台收货地址" prop="deliveryAddress">
              <el-input v-model="setParams.deliveryAddress" placeholder="请输入平台收货地址" clearable />
            </el-form-item>
            <el-form-item label="收货人" prop="consignee">
              <el-input v-model="setParams.consignee" placeholder="请输入收货人" clearable />
            </el-form-item>
            <el-form-item label="收货人手机号码" prop="contactInfo">
              <el-input v-model="setParams.contactInfo" placeholder="请输入收货人手机号码" clearable />
            </el-form-item>
           
          </el-form>
          <div>
            <el-button type="primary" v-if="!isEdit" @click="isEdit = true">立即编辑</el-button>
            <template v-else>
              <el-button type="danger" @click="revoke">撤销</el-button>
              <el-button type="primary" :loading="loading_submit" @click="_setData">确认修改</el-button>
            </template>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AfterSaleSet',

  data() {
    return {
      isEdit: false,
      loadding_data: false,
      loading_submit: false,
      setParams: {
        deliveryAddress: '',
        consignee: '',
        contactInfo: ''
      },
      rules: {
        deliveryAddress: [{required: true, message: '平台收货地址不能为空', trigger: 'blur'}],
        consignee: [{required: true, message: '收货人不能为空', trigger: 'blur'}],
        contactInfo: [
          {required: true, message: '收货人手机号码不能为空', trigger: 'blur'},
          {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确手机号码', trigger: 'blur'}
        ],
      }
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取设置参数数据 */
    async _getData() {
      this.loadding_data = true;
      let res = await this.$api.get_afterSaleSet_data();
      this.setParams = res.data || {};
    },
    /**设置 设置参数 数据 */
    _setData() {
      this.$refs['formRef'].validate(async (valid) => {
        if(valid) {
          this.loading_submit = true;
          try{
            await this.$api.get_afterSaleSet_data(this.setParams);
            this.$message.success('修改成功！');
            this.isEdit = false;
          }catch(e) {
            this._getData();
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }
      })
    },
    /**撤销*/
    revoke() {
      this.$refs['formRef'].clearValidate();

      this._getData();
      this.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>