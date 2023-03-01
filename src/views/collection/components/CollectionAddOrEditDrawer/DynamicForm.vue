<template>
  <el-form 
    class="dynamic-form"
    ref="formRef_dynamic" :model="detailInfo.collectionAttrTemplateDTO_convert" :rules="rules_dynamic" 
    label-width="100px" label-position="left"
  >
    <template v-for="item in dynamicPropList">
      <!-- 条件渲染规则说明 if: 'colType=2' 指的是detailInfo.colType == 2 时显示-->
      <el-form-item 
        :label="item.attrLabel" :prop="item.attrName" :key="item.attrName"
        :rules="item.optional == 2 ? [{required: true, message: `${item.attrLabel}不能为空`}] : []"
        v-if="item.if ? detailInfo[item.if.split('=')[0]] == item.if.split('=')[1] : true"
      >
        <template v-if="item.uiType == 'input'">
          <el-input v-model="detailInfo.collectionAttrTemplateDTO_convert[item.attrName]"
            :placeholder="`请输入${item.attrLabel}`" clearable
            :disabled="item.disabled && drawerType == 'edit'" />
        </template>
        <template v-else-if="item.uiType == 'gb-input-number'">
          <gb-input-number
            :limit-type="item.limitType ? item.limitType : 'float'" v-model="detailInfo.collectionAttrTemplateDTO_convert[item.attrName]"
            :placeholder="`请输入${item.attrLabel}`" :unit="item.unit"
            :disabled="item.disabled && drawerType == 'edit'" />
        </template>
        <template v-else-if="item.uiType == 'single-img-upload'">
          <uploader-single-file
            :file-url.sync="detailInfo.collectionAttrTemplateDTO_convert[item.attrName]"
            :upload-area-size="item.uploadAreaSize ? item.uploadAreaSize : {width: '298px', height: '200px'}"
            :iconSize="item.iconSize ? item.iconSize : 'medium'"
            :ratio="item.ratio ? item.radio : undefined"
            :img-fit="item.imgFit ? item.imgFit : 'contain'"
            :disabled="item.disabled ? item.disabled && drawerType == 'edit' : false"
            @verify="$refs['formRef_dynamic'].validateField(item.attrName)" />
        </template>
        <template v-else-if="item.uiType == 'file-upload'">
          <FileUpload 
            :file-url.sync="detailInfo.collectionAttrTemplateDTO_convert[item.attrName]"
            :accept="item.accept ? item.accept : '.mtl,.obj'"
            :file-size="item.fileSize ? item.fileSize : 20"
            :disabled="item.disabled && drawerType == 'edit'" />
        </template>
        <template v-else>
          <span class="text_red">uiType: "{{ item.uiType }}" 不存在</span>
        </template>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import { UploaderSingleFile, FileUpload } from '@/components/global/GbAddAndEditDialog/components'

export default {
  name: 'DynamicForm',
  components: { UploaderSingleFile, FileUpload },
  
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
    // 动态属性列表
    dynamicPropList: {
      type: Array,
      require: true
    },
  },
  computed: {
    rules_dynamic() {
      let finnalRules = {};

      this.dynamicPropList.forEach((item, index) => {
        let ruleArr = [];

        // 不为空验证项
        if(item.optional == 1) {
          let handleTrigger = ['select', 'radio'].includes(item.uiType) ? 'change' : 'blur';

          let ruleObj = {required: true, message: `${item.label}不能为空`, trigger: handleTrigger};
          ruleArr.push(ruleObj);
        }
        // 验证项数组不为空，才给该 字段 添加验证规则
        if(ruleArr.length != 0) {
          finnalRules[item.prop] = ruleArr;
        }
      })
      return finnalRules
    }
  },

  methods: {
    // 父组件调用校验方法
    async formValidate() {
      try {
        // 若表单验证不通过,会抛出错误,终止程序
        await this.$refs['formRef_dynamic'].validate();
        return true;
      }catch(e) {
        return false
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>