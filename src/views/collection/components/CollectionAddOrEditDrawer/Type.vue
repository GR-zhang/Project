<template>
  <el-form ref="formRef_1" :model="detailInfo.collectionShippingVO" :rules="rules_1" 
    label-width="100px" label-position="left"
  >
    <el-form-item label="藏品类型">
      <el-radio-group v-model="detailInfo.colType" :disabled="drawerType == 'edit'">
        <el-radio v-for="item in options_collectonType" :key="item.value"
          :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 实物藏品显示 -->
    <template v-if="detailInfo.colType == 2">
      <el-form-item label="运费类型">
        <el-radio-group v-model="detailInfo.collectionShippingVO.shippingType">
          <el-radio v-for="item in options_shippingType" :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 运费类型决定显示 -->
      <el-form-item v-if="detailInfo.collectionShippingVO.shippingType == 2" label="固定运费" prop="price">
        <gb-input-number v-model="detailInfo.collectionShippingVO.price" placeholder="请输入固定运费" unit="元" />
      </el-form-item>
      <el-form-item v-else-if="detailInfo.collectionShippingVO.shippingType == 3" label="运费模板" prop="shippingId">
        <gb-select-api 
          v-model="detailInfo.collectionShippingVO.shippingId"
          :api-func="$api.get_shippingTemplate_list" :props="{label: 'shippingName', value: 'shippingId'}" />
      </el-form-item>

      <el-form-item label="提货后可售卖">
        <el-radio-group v-model="detailInfo.collectionShippingVO.takeSale">
          <el-radio v-for="item in options_booleanStatus" :key="item.value"
            :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import { collectionTypeMap, shippingTypeMap, booleanStatusMap, generateOptionsByMap } from '@/config'

import { GbSelectApi } from '@/components/global'

export default {
  name: 'Type',
  components: {GbSelectApi},

  props: {
    // 抽屉类型，决定抽屉标题
    drawerType: {
      type: String,
      required: true
    },
    // 详细信息
    detailInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options_collectonType: generateOptionsByMap(collectionTypeMap),
      options_shippingType: generateOptionsByMap(shippingTypeMap),
      options_booleanStatus: generateOptionsByMap(booleanStatusMap),
      rules_1: {
        price: [{required: true, message: '固定运费不能为空', trigger: 'blur'}],
        shippingId: [{required: true, message: '运费模板不能为空', trigger: 'change'}],
      }
    }
  },

  methods: {
    // 父组件调用校验方法
    async formValidate() {
      // 若表单验证不通过,会抛出错误,终止程序
      await this.$refs['formRef_1'].validate();
      return true;
    },
    // 父组件调用重置校验方法
    async resetFormValidate() {
      this.$refs['formRef_1'].clearValidate();
    },
  }
}
</script>

<style lang="scss" scoped>

</style>