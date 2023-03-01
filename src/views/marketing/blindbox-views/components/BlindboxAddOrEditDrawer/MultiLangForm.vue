<template>
  <el-tabs v-model="activeLang" type="border-card" class="multi-lang-tabs mb_10">
    <el-tab-pane 
      v-for="item in langList" :key="item.value"
      :label="item.label" :name="item.value"
    >
      <el-form
        class="multi-lang-form"
        ref="formRef_multiLang" 
        :model="detailInfo.blindBoxLangPOList_convert[item.value]" 
        :rules="rules_multiLang" 
        label-width="95px" label-position="left"
      >
        <el-form-item label="盲盒名称" prop="boxName">
          <el-input 
            v-model="detailInfo.blindBoxLangPOList_convert[item.value].boxName" 
            placeholder="请输入盲盒名称" clearable :disabled="drawerType == 'detail'" />
        </el-form-item>
        <el-form-item label="盲盒简介" prop="rightsExplain">
          <tinymce
            v-if="drawerVisible" :id="'vue-tinymce-' + item.value"
            v-model="detailInfo.blindBoxLangPOList_convert[item.value].rightsExplain" 
            :disabled="drawerType == 'detail'"
            @verify="$refs['formRef_multiLang'][activeLang - 1].validateField('rightsExplain')" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getLangList, getValue } from '@/utils/lang-data-hanlde'

export default {
  name: 'MultiLangForm',
  components: { Tinymce },

  props: {
    // 抽屉类型，决定抽屉标题
    drawerType: {
      type: String,
      required: true
    },
    // 抽屉是否可见
    drawerVisible: {
      type: Boolean,
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
        boxName: [{required: true, message: '盲盒名称不能为空', trigger: 'blur'}],
        rightsExplain: [{required: true, message: '盲盒简介不能为空', trigger: 'blur'}]
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
          let oneItem =  this.detailInfo.blindBoxLangPOList_convert[item.value];
          return !oneItem.boxName || !oneItem.rightsExplain;
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