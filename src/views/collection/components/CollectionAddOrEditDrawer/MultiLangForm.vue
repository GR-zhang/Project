<template>
  <el-tabs v-model="activeLang" type="border-card" class="multi-lang-tabs mb_10">
    <el-tab-pane 
      v-for="item in langList" :key="item.value"
      :label="item.label" :name="item.value"
    >
      <el-form 
        class="multi-lang-form"
        ref="formRef_multiLang" 
        :model="detailInfo.collectionLangVOList_convert[item.value]" 
        :rules="rules_multiLang" 
        label-width="100px" label-position="left"
      >
        <el-form-item label="藏品名称" prop="colName">
          <el-input 
            v-model="detailInfo.collectionLangVOList_convert[item.value].colName" 
            placeholder="请输入藏品名称" clearable :disabled="drawerType == 'edit'" />
        </el-form-item>
        <el-form-item label="藏品简介" prop="details">
          <tinymce
            v-if="drawerVisible" :id="'vue-tinymce-' + item.value"
            v-model="detailInfo.collectionLangVOList_convert[item.value].details" 
            :disabled="drawerType == 'edit'"
            @verify="$refs['formRef_multiLang'][activeLang - 1].validateField('details')" />
        </el-form-item>
        <el-form-item label="权益须知">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入权益须知"
            v-model="detailInfo.collectionLangVOList_convert[item.value].rightsExplain">
          </el-input>
        </el-form-item>
        <el-form-item label="购买须知">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入购买须知"
            v-model="detailInfo.collectionLangVOList_convert[item.value].purchaseNotes">
          </el-input>
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
        colName: [{required: true, message: '藏品名称不能为空', trigger: 'blur'}],
        details: [{required: true, message: '藏品简介不能为空', trigger: 'blur'}]
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
          let oneItem =  this.detailInfo.collectionLangVOList_convert[item.value];
          return !oneItem.colName || !oneItem.details;
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

<style lang="scss">

</style>

<style lang="scss" scoped>

</style>