<template>
  <el-tabs v-model="activeLang" type="border-card" class="multi-lang-tabs mb_10">
    <el-tab-pane 
      v-for="item in langList" :key="item.value"
      :label="item.label" :name="item.value"
    >
      <el-form 
        class="multi-lang-form"
        ref="formRef_multiLang" 
        :model="detailInfo.activityAirdropLangPOList_convert[item.value]" 
        :rules="rules_multiLang" 
        label-width="95px" label-position="left"
      >
        <el-form-item label="空投名称" prop="activityName">
          <el-input 
            :disabled="drawerType == 'detail'"
            v-model="detailInfo.activityAirdropLangPOList_convert[item.value].activityName" placeholder="请输入空投名称" clearable />
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
    // 抽屉类型，决定抽屉标题
    drawerType: {
      type: String,
      required: true
    },
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
        activityName: [{required: true, message: '空投名称不能为空', trigger: 'blur'}],
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
          let oneItem =  this.detailInfo.activityAirdropLangPOList_convert[item.value];
          return !oneItem.activityName;
        })
        if(containNull) {
          this.$message.warning('多语言每一种语言 必填项 都不能为空,请检查！');
          return false;
        }else {
          return true;
        }
      }catch(e) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>