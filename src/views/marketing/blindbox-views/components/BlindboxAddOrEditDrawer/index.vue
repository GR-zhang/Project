<template>
  <el-drawer
    class="blindbox-add-or-edit-drawer"
    :title="cpt_finnalTitle"
    :visible.sync="syncedDrawerVisible"
    :before-close="handleCloseDialog"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <div class="backtop1 content-scroll" v-loading="loading_data">
      
      <el-form
        ref="dialogFormRef" style="padding: 0 20px;"
        :model="detailInfo" :rules="rules"
        label-position="left" label-width="95px"
      > 
        <!-- 多语言表单 -->
        <MultiLangForm 
          ref="formRef_multiLang" :detailInfo="detailInfo"
          :drawer-type="drawerType" :drawer-visible="drawerVisible" />
        <el-form-item label="盲盒主图" prop="picture">
          <uploader-single-file
            :disabled="drawerType == 'detail'"
            :file-url.sync="detailInfo.picture" 
            :uploadAreaSize="{width: '150px', height: '150px'}" iconSize="small"
            @verify="$refs['dialogFormRef'].validateField('picture')"
            ratio="130*130px"

            upload-img-thumb 
            @get-img-thumb="val => detailInfo.thumb = val" />
        </el-form-item>
        <div><el-checkbox v-model="detailInfo.isPreSale">预售设置</el-checkbox></div><br/>
        <el-form-item
          v-if="detailInfo.isPreSale"
          label="预售时间" prop="preSaleTime"
        >
          <el-date-picker
            v-model="detailInfo.preSaleTime"
            type="datetime" value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="销售单价" prop="boxPrice">
          <gb-input-number
            :disabled="drawerType == 'detail'"
            v-model="detailInfo.boxPrice" placeholder="请输入销售单价" unit="元" />
        </el-form-item>
        <el-form-item label="盲盒款式" prop="blindBoxGoodsVOList">
          <!-- 添加或编辑显示 -->
          <template v-if="drawerType != 'detail'">
            <el-button
              icon="el-icon-circle-plus-outline"
              type="primary" size="mini"
              @click="drawerVisible_nested = true;">添加</el-button>
            <el-table :data="detailInfo.blindBoxGoodsVOList" key="!detail">
              <el-table-column label="藏品名称" prop="colName" min-width="150" />
              <el-table-column label="首发剩余库存" prop="residualStock" min-width="100" />
              <el-table-column v-if="drawerType == 'add'" label="活动库存" width="200" key="colStock">
                <template v-slot="{ row }">
                  <gb-input-number limit-type="integer" v-model="row.colStock" placeholder="请输入" unit="个" />
                </template>
              </el-table-column>
              <el-table-column v-if="drawerType == 'edit'" label="活动剩余库存" width="200" key="surplusStock">
                <template v-slot="{ row }">
                  <gb-input-number limit-type="integer" v-model="row.surplusStock" placeholder="请输入" unit="个" />
                </template>
              </el-table-column>
              <el-table-column v-if="drawerType == 'edit'" label="已抽取数量" prop="extractNum" min-width="100" key="extractNum" />
              <el-table-column label="操作" min-width="80" align="center">
                <template v-slot="{ $index }">
                  <el-button type="text" class="text_red" @click="
                    detailInfo.blindBoxGoodsVOList.splice($index, 1);
                    $refs['dialogFormRef'].validateField('blindBoxGoodsVOList');
                  ">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 抽屉【藏品选择】 -->
            <collection-multi-select-drawer
              :visible.sync="drawerVisible_nested"
              title="藏品选择"
              :active-rows="detailInfo.blindBoxGoodsVOList"
              :active-ids="cpt_activeIds"
              @sel-row="handleSelRow" />
          </template>
          <!-- 详情显示 -->
          <template v-else>
            <el-table :data="detailInfo.blindBoxGoodsVOList" key="detail">
              <el-table-column label="藏品名称" prop="colName" min-width="150" />
              <el-table-column label="藏品主图" min-width="100">
                <template v-slot="{ row }">
                  <el-image
                    :style="{width: '45px', height: '45px'}"
                    :src="row.colPicture"
                    fit="contain"
                    :preview-src-list="[row.colPicture]"
                  >
                    <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                      <i class="el-icon-picture-outline" style="font-size: 30px;" />
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column label="活动库存" prop="colStock" min-width="100" />
              <el-table-column label="活动剩余库存" prop="surplusStock" min-width="100" />
              <el-table-column label="已抽取数量" prop="extractNum" min-width="100" />
              <el-table-column label="概率"  min-width="100">
                <template v-slot="{ row }">{{ row.probability }}%</template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
      </el-form>
      <!-- 返回顶部 -->
      <el-backtop target=".backtop1" />
    </div>
    <div class="drawer-operation-btn">
      <!-- 添加或编辑显示 -->
      <template v-if="drawerType != 'detail'">
        <el-button @click="handleCloseDialog" size="medium">取消</el-button>
        <el-button
          :loading="syncedSubmitLoading" :disabled="loading_data"
          type="primary" @click="handleSubmit" size="medium">确定</el-button>
      </template>
      <!-- 详情显示 -->
      <el-button v-else @click="handleCloseDialog" size="medium">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { airdropMethodMap, generateOptionsByMap  } from '@/config'
import { queryDataConvert, addPlaceholderData } from '@/utils/lang-data-hanlde'

import { CollectionMultiSelectDrawer } from '@/components/business'
import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import Tinymce from '@/components/Tinymce'
import MultiLangForm from './MultiLangForm.vue'

export default {
  name: 'BlindboxAddOrEditDrawer',
  components: { CollectionMultiSelectDrawer, UploaderSingleFile, Tinymce, MultiLangForm },

  props: {
    // 抽屉是否可见
    drawerVisible: {
      type: Boolean,
      required: true
    },
    // 抽屉类型
    drawerType: {
      type: String,
      required: true
    },
      // 抽屉主题
      drawerTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    // 操作id
    id: {
      type: String,
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var checkBlindBoxGoodsVOList = (rule, value, callback) => {    
      if(this.drawerType == 'add') {
        value.some(item => !item.colStock) ? callback(new Error('活动库存列不能为空或等于0')) : callback();
      }else if(this.drawerType == 'edit') {
        value.some(item => !item.surplusStock) ? callback(new Error('活动剩余库存列不能为空或等于0')) : callback();
      }else {
        callback();
      }
    };

    return {
      // 表单
      options_airdropMethod: generateOptionsByMap(airdropMethodMap),
      rules: {
        picture: [{required: true, message: '盲盒主图不能为空', trigger: 'blur'}],
        preSaleTime: [{required: true, message: '预售时间不能为空', trigger: 'change'}],
        boxPrice: [{required: true, message: '销售单价不能为空', trigger: 'blur'}],
        blindBoxGoodsVOList: [
          {required: true, message: '盲盒款式不能为空', trigger: 'blur'},
          {validator: checkBlindBoxGoodsVOList, trigger: 'change'}
        ],
      },
      drawerVisible_nested: false,

      // 表格
      detailInfo: {
        boxName: undefined,
        
        blindBoxGoodsVOList: [],
        blindBoxLangPOList_convert: addPlaceholderData({
          boxName: '',
          rightsExplain: ''
        })
      },
      loading_data: false
    }
  },
  computed: {
    // 双向数据绑定drawerVisible
    syncedDrawerVisible: {
      get() {
        return this.drawerVisible;
      },
      set(newVal) {
        this.$emit('update:drawerVisible', newVal);
      }
    },
    // 双向数据绑定submitLoading
    syncedSubmitLoading: {
      get() {
        return this.submitLoading;
      },
      set(newVal) {
        this.$emit('update:submitLoading', newVal);
      }
    },
    // 已选中id数组
    cpt_activeIds() {
      return (this.detailInfo.blindBoxGoodsVOList).map(item => item.colId)
    },
    // 最终标题
    cpt_finnalTitle() {
      if(this.drawerType == 'detail') {
        return '盲盒详情';
      }
      return (this.drawerType == 'add' ? '添加' : '编辑') + this.drawerTopic;
    }
  },

  watch: {
    syncedDrawerVisible(val) {
      if(val) {
        if(this.drawerType == 'add') {
          this.detailInfo = {
            blindBoxGoodsVOList: [],
            blindBoxLangPOList_convert: addPlaceholderData({
              boxName: '',
              rightsExplain: ''
            })
          }
        }else {
          // 编辑与详情查询数据
          this._getList()
        }
      }
    }
  },

  methods: {
    // 提交
    async handleSubmit() {
      let flag_multiLang = await this.$refs['formRef_multiLang'].formValidate();
      if(!flag_multiLang) { return };

      this.$refs.dialogFormRef.validate(valid => {
        if(valid) {
          this.syncedSubmitLoading = true;
          this.$emit('submit');
        }
      })
    },
    // 关闭抽屉
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();

      this.syncedDrawerVisible = false;
    },
    /**获取盲盒详情*/
    async _getList() {
      this.loading_data = true;
      try{
        let res = await this.$api.get_blindbox_detailInfo(this.id);
        this.detailInfo = { 
          ...res.data || {},
          preSaleTime: res.data.preSaleTime ? res.data.preSaleTime * 1000 : null,
          isPreSale: !!res.data.preSaleTime,
          // 多语言处理
          blindBoxLangPOList_convert: queryDataConvert(res.data.blindBoxLangPOList),
          blindBoxLangPOList: undefined
        };
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    },
    /**选中一行*/
    handleSelRow(row) {
      let index = this.detailInfo.blindBoxGoodsVOList.findIndex(item => item.colId == row.colId);
      if(index !== -1) {//选中旧行,splice
        this.detailInfo.blindBoxGoodsVOList.splice(index, 1);
      }else {//选中新行,push
        this.detailInfo.blindBoxGoodsVOList.push({
          colId: row.colId,
          colName: row.colName,
          colStock: undefined,
          surplusStock: undefined,
          residualStock: row.stock
        });
      }

      this.$refs['dialogFormRef'].validateField('blindBoxGoodsVOList');
    }
  }
}
</script>

<style lang="scss" scoped>
.content-scroll {
  overflow-y: auto;
  height: calc(100vh - 140px);
}
</style>