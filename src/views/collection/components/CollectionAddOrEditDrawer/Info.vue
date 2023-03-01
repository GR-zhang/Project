<template>
  <el-form ref="formRef_2" :model="detailInfo" :rules="rules_2" 
    label-width="100px" label-position="left"
  >
    <!-- 多语言表单 -->
    <MultiLangForm 
      ref="formRef_multiLang" :detailInfo="detailInfo"
      :drawer-type="drawerType" :drawer-visible="drawerVisible" />

    <el-form-item label="藏品推荐">
      <el-radio-group v-model="detailInfo.recommend">
        <el-radio v-for="item in options_collectionRecom" :key="item.value"
          :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="藏品性质">
      <el-radio-group v-model="detailInfo.colNature" :disabled="drawerType == 'edit'">
        <el-radio v-for="item in options_collectionNature" :key="item.value"
          :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="权重" prop="colSort">
      <gb-input-number limit-type="integer" v-model="detailInfo.colSort" placeholder="请输入权重" />
      <div class="form_control_tip">权重越小,排序越前</div>
    </el-form-item>
    <el-form-item label="销售单价" prop="defaultSalePrice">
      <gb-input-number v-model="detailInfo.defaultSalePrice" placeholder="请输入销售单价" unit="元" />
    </el-form-item>
    <el-form-item label="藏品图片" prop="picture">
      <uploader-single-file 
        :file-url.sync="detailInfo.picture"
        @verify="$refs['formRef_2'].validateField('picture')"
        :disabled="drawerType == 'edit'"
        :uploadAreaSize="{width: '150px', height: '150px'}"
        ratio="376*376px"
        
        upload-img-thumb 
        @get-img-thumb="val => detailInfo.thumb = val" />
    </el-form-item>
    <el-form-item label="藏品视频">
      <uploader-single-file :file-url.sync="detailInfo.video" :limit="video_limit" ratio="16:9" />
    </el-form-item>
    <el-form-item label="所属创作者" prop="designerId">
      <createrSelect 
        v-model="detailInfo.designerId"
        :tag-name.sync="detailInfo.designerName"
        @validate="
          $refs['formRef_2'].validateField('designerId');
          detailInfo.seriesId = undefined;
        "
        :disabled="drawerType == 'edit'" />
    </el-form-item>
    <el-form-item v-if="detailInfo.designerId" label="所属系列" prop="seriesId">
      <el-select v-model="detailInfo.seriesId" placeholder="请选择所属系列" clearable filterable :disabled="drawerType == 'edit'">
        <el-option v-for="item in options_series" :key="item.value"
          :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="创作时间">
      {{ detailInfo.createTime | parseTime('{y}-{m}-{d}') }}
    </el-form-item>
    <!-- <el-form-item label="藏品长度" prop="length">
      <gb-input-number v-model="detailInfo.length" placeholder="请输入藏品长度" />
    </el-form-item>
    <el-form-item label="藏品宽度" prop="wide">
      <gb-input-number v-model="detailInfo.wide" placeholder="请输入藏品宽度" />
    </el-form-item> -->

    <!-- 动态表单 -->
    <dynamic-form ref="formRef_dynamic" :detailInfo="detailInfo" :drawer-type="drawerType" :dynamicPropList="dynamicPropList" />
  </el-form>
</template>

<script>
import { booleanStatusMap, collectionNatureMap, generateOptionsByMap } from '@/config'
import FmHelper from '@/components/global/GbAddAndEditDialog/utils/fm-helper'

import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import { CreaterSelect } from '@/components/business'
import DynamicForm from './DynamicForm.vue'
import MultiLangForm from './MultiLangForm.vue'

export default {
  name: 'Info',
  components: { UploaderSingleFile, CreaterSelect, DynamicForm, MultiLangForm },

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
      required: true
    },

    // 抽屉是否可见
    drawerVisible: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      options_collectionRecom: generateOptionsByMap(booleanStatusMap),
      options_collectionNature: generateOptionsByMap(collectionNatureMap),
      options_series: [],
      // 藏品视频limit
      video_limit: {
        isImg: false,
        accept: FmHelper.videoFormat,//文件类型
        size: 100 * (1024*1024)
      },
      rules_2: {
        colSort: [{required: true, message: '权重不能为空', trigger: 'blur'}],
        defaultSalePrice: [{required: true, message: '销售单价不能为空', trigger: 'blur'}],
        picture: [{required: true, message: '藏品图片不能为空', trigger: 'blur'}],
        designerId: [{required: true, message: '所属创作者不能为空', trigger: 'change'}],
        seriesId: [{required: true, message: '所属系列不能为空', trigger: 'change'}],
        length: [{required: true, message: '藏品长度不能为空', trigger: 'blur'}],
        wide: [{required: true, message: '藏品宽度不能为空', trigger: 'blur'}],
      }
    }
  },

  watch: {
    /**所属创作者改变，设置该创作者的系列options*/
    async 'detailInfo.designerId'(val) {
      let res = await this.$api.get_series_list({
        params: {pageNum: 1, pageSize: 9999},
        data: {designerId: val}
      })
      this.options_series = (res.data.rows || []).map(item => ({
        label: item.seriesName,
        value: item.seriesId
      }))
    }
  },

  methods: {
    // 父组件调用校验方法
    async formValidate() {
      // formRef_dynamic表单验证
      let flag_dynamic = await this.$refs['formRef_dynamic'].formValidate();
      let flag_multiLang = await this.$refs['formRef_multiLang'].formValidate();
      // 若表单验证不通过,会抛出错误,终止程序
      await this.$refs['formRef_2'].validate();
      return true && flag_dynamic && flag_multiLang;
    },
    // 父组件调用重置校验方法
    async resetFormValidate() {
      this.$refs['formRef_2'].clearValidate();
    },
  }
}
</script>

<style lang="scss" scoped>

</style>