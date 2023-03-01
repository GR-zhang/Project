<template>
  <div class="table_card">
    <div class="page_title">链设置</div>
    <el-row>
      <el-col :md="24" :lg="12">
        <el-form 
          ref="formRef"
          :model="formData" :rules="rules"
          label-position="left" label-width="140px"
          :disabled="!isEdit"
        >
          <el-form-item label="链类型" prop="chainId">
            <el-select v-model="formData.chainId" placeholder="请选择">
              <el-option v-for="item in options_chainType" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="链名称" prop="chainName">
            <el-input v-model="formData.chainName" placeholder="请输入链名称" clearable />
          </el-form-item>
          <el-form-item label="NFT合约地址" prop="contractAddr">
            <el-input v-model="formData.contractAddr" placeholder="请输入NFT合约地址" clearable />
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input v-model="formData.description" placeholder="请输入说明" clearable />
          </el-form-item>
          <el-form-item label="RPC URL" prop="httpUrl">
            <el-input v-model="formData.httpUrl" placeholder="请输入RPC URL" clearable />
          </el-form-item>
          <el-form-item label="链所属" prop="mainChain">
            <el-select v-model="formData.mainChain" placeholder="请选择">
              <el-option v-for="item in options_mainchainType" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="合约支持协议" prop="protocol">
            <el-select v-model="formData.protocol" placeholder="请选择">
              <el-option v-for="item in options_protocol" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
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
import { generateOptionsByMap } from '@/config'

// 链类型
const chainTypeMap = new Map([
  [1, '以太坊'],
  [2, '币安智能链'],
  [3, '火币生态链'],
  [4, 'Polygon'],
  [5, '波场'],
  [6, 'BSN文昌链'],
  [7, '百度链'],
  [8, 'bsn天舟链']
])
// 链所属
const mainchainTypeMap = new Map([
  [1, '主网'],
  [2, '测试网']
])
// 合约支持协议
const protocolMap = new Map([
  ['ERC721', 'ERC721'],
  ['ERC1155', 'ERC1155'],
  ['ERC20', 'ERC20']
])

export default {
  name: 'ChainSet',

  data() {
    return {
      formData: {}, // 表单数据
      editDisabled: false,// 禁用编辑
      options_chainType: generateOptionsByMap(chainTypeMap),
      options_mainchainType: generateOptionsByMap(mainchainTypeMap),
      options_protocol: generateOptionsByMap(protocolMap),
      

      isEdit: false,
      loading_submit: false,
      
      rules: {
        chainId: [{required: true, message: '链类型不能为空', trigger: 'change'}],
        chainName: [{required: true, message: '链名称不能为空', trigger: 'blur'}],
        contractAddr: [{required: true, message: 'NFT合约地址不能为空', trigger: 'blur'}],
        description: [{required: true, message: '说明不能为空', trigger: 'blur'}],
        httpUrl: [{required: true, message: ' RPC URL不能为空', trigger: 'blur'}],
        mainChain: [{required: true, message: '链所属不能为空', trigger: 'change'}],
        protocol: [{required: true, message: '合约支持协议不能为空', trigger: 'change'}],
      }
    }
  },

  created() {
    this._getData();
  },

  methods: {
    /**获取参数*/
    async _getData() {
      this.editDisabled = true;
      try {
        let res = await this.$api.get_chainSet();
        this.formData = res.data || {};

        await this.$nextTick();
        this.setDataCache();
      }catch(e) {
        throw e;
      }finally {
        this.editDisabled = false;
      }
    },
    /**设置参数*/
    async _setData() {
      this.$refs['formRef'].validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try {
            await this.$api.set_chainSet(this.formData);
            this.$message.success('修改成功！');
            this.setDataCache();
            this.isEdit = false;
          }catch(e) {
            this.formData = { ...this.formData_cache };
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
      
      this.formData = { ...this.formData_cache };
      this.isEdit = false;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>