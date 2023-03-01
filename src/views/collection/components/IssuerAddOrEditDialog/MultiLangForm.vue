<template>
  <el-tabs v-model="activeLang" type="border-card" class="multi-lang-tabs mb_10">
    <el-tab-pane 
      v-for="item in langList" :key="item.value"
      :label="item.label" :name="item.value"
    >
      <el-form 
        class="multi-lang-form"
        ref="formRef_multiLang" 
        :model="detailInfo.distributionCompanyLangPOList_convert[item.value]" 
        :rules="rules_multiLang" 
        label-width="110px" label-position="left"
      >
        <el-form-item label="发行方名称" prop="name">
          <el-input 
            v-model="detailInfo.distributionCompanyLangPOList_convert[item.value].name" placeholder="请输入发行方名称" clearable />
        </el-form-item>
        <el-form-item label="发行方简介" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入发行方简介"
            v-model="detailInfo.distributionCompanyLangPOList_convert[item.value].description" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getLangList, getValue } from '@/utils/lang-data-hanlde'


export default {
  name: 'MultiLangForm',

  props: {
    // 详细信息
    detailInfo: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      activeLang: getValue(),//当前语言
      langList: getLangList(),
      rules_multiLang: {
        name: [{required: true, message: '发行方名称不能为空', trigger: 'blur'}],
        description: [{required: true, message: '发行方简介不能为空', trigger: 'blur'}]
      }
    }
  },

  methods: {
    // 父组件调用校验方法
    async formValidate() {
      try {
        // 若表单验证不通过,会抛出错误,终止程序
        await this.$refs['formRef_multiLang'][this.activeLang - 1].validate();

        //ps: 校验各个语言必填项目是否为空，空则提示警告
        let containNull = this.langList.some(item => {
          let oneItem =  this.detailInfo.distributionCompanyLangPOList_convert[item.value];
          return !oneItem.name || !oneItem.description;
        })
        if(containNull) {
          this.$message.warning('多语言每一种语言 必填项 都不能为空,请检查！');
          return false;
        }else {
          return true;
        }
      }catch(e) {
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>