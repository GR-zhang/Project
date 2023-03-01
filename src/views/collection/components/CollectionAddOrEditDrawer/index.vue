<template>
  <el-drawer
    :title="(drawerType == 'add' ? '添加' : '编辑') + drawerTopic" 
    size="85%" :wrapper-closable="false" direction="ltr"
    :visible.sync="syncedDrawerVisible"
    :before-close="closeDrawer"
  >
    <div style="border-bottom: 1px solid #ebeef5;padding: 0 70px;">
      <el-steps :active="tabActive * 1" finish-status="success">
        <el-step title="选择藏品类型" description="设定以何种类型发售"></el-step>
        <el-step title="填写藏品信息" description="用于前端藏品信息展示以及上链信息"></el-step>
        <el-step title="填写藏品购买权限" description="用于设定藏品得相关购买权限"></el-step>
        <el-step title="填写藏品营销" description="设置藏品的营销模式"></el-step>
      </el-steps>
    </div>
    <div class="content pt_10" v-loading="loading_data">
      <el-tabs tab-position="left" v-model="tabActive">
        <el-tab-pane label="选择藏品类型" name="1" :disabled="!tabCanClick.includes('1')" class="p_x_30">
          <type ref="typeRef" :detail-info="detailInfo" :drawer-type="drawerType" />
        </el-tab-pane>

        <el-tab-pane label="填写藏品信息" name="2" :disabled="!tabCanClick.includes('2')" class="p_x_30">
          <info ref="infoRef" :detail-info="detailInfo" :drawer-type="drawerType" 
            :dynamic-prop-list="dynamicPropList" :drawer-visible="syncedDrawerVisible" />
        </el-tab-pane>

        <el-tab-pane label="填写藏品购买权限" name="3" :disabled="!tabCanClick.includes('3')" class="p_x_30">
          <el-form 
            ref="formRef_3" :model="detailInfo"
            label-width="110px" label-position="left"
          >
            <el-form-item label="藏品限购">
              <el-radio-group v-model="detailInfo.restricted">
                <el-radio v-for="item in options_collectionPurchaseLimit" :key="item.value"
                  :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item 
              v-if="detailInfo.restricted == 1" label="最多购买数量"
              prop="restrictedNum" :rules="[{required: true, message: '最多购买数量不能为空', trigger: 'blur'}]"
            >
              <gb-input-number 
                limit-type="integer" v-model="detailInfo.restrictedNum"
                placeholder="请输入最多购买数量" unit="个" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="填写藏品营销" name="4" :disabled="!tabCanClick.includes('4')" class="p_x_30">
           <el-form
            ref="formRef_4" :model="detailInfo" :rules="rules_4"
            label-width="100px" label-position="left"
           >
            <el-form-item label="藏品预售设置">
              <el-radio-group v-model="detailInfo.preSale">
                <el-radio v-for="item in options_collectionPreSale" :key="item.value"
                  :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="detailInfo.preSale == 1"
              label="预售时间" prop="preSaleStart"
            >
              <el-date-picker
                v-model="detailInfo.preSaleStart"
                type="datetime" value-format="timestamp"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 返回顶部 -->
      <el-backtop target=".content"></el-backtop>
    </div>
    <div class="drawer-operation-btn">
      <el-button size="medium" style="margin-right: 50px;" @click="enterStep('prev')"
        :disabled="tabActive == '1'"
      >
        上一步
        <span v-if="tabActive == '2'">(选择藏品类型)</span>
        <span v-else-if="tabActive == '3'">(填写藏品信息)</span>
        <span v-else-if="tabActive == '4'">(填写藏品购买权限)</span>
      </el-button>
      <!-- 【详情】操作才显示 -->
      <el-button v-if="tabActive == 4 && noSubmit" size="medium" type="primary" @click="closeDrawer()">关闭</el-button>
       <!-- 【非详情】操作才显示 -->
      <el-button size="medium" type="primary" @click="enterStep('next')"
        v-else
        :loading="tabActive == 4 && loading_submit" :disabled="loading_data"
      >
        下一步
        <span v-if="tabActive == '1'">(填写藏品信息)</span>
        <span v-else-if="tabActive == '2'">(填写藏品购买权限)</span>
        <span v-else-if="tabActive == '3'">(填写藏品营销)</span>
        <span v-else-if="tabActive == '4'">(提交)</span>
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import { booleanStatusMap, generateOptionsByMap } from '@/config'
import { parseTime } from '@/utils'
import precisionCalc from '@/utils/precision-calc'
import { queryDataConvert, addPlaceholderData, submitDataConvert, getLangList } from '@/utils/lang-data-hanlde'

import Info from './Info.vue'
import Type from './Type.vue'

// 默认藏品运费信息对象
const default_collectionShippingVO = {
  price: undefined,
  shippingId: undefined,
  shippingType: 1,//默认运费类型: 包邮
  takeSale: 2 //默认提货后可售卖: 否
};

export default {
  name: 'CollectionAddOrEditDrawer',
  components: { Info, Type },

  props: {
    // 抽屉是否可见
    drawerVisible: {
      type: Boolean,
      required: true
    },
    // 抽屉类型，决定抽屉标题
    drawerType: {
      type: String,
      required: true
    },
      // 抽屉主题
      drawerTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    
    // 藏品id
    id: {
      type: String,
      required: true
    },
    // 用在【详情】操作，不能提交数据
    noSubmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 选项卡
      tabActive: '1',
      tabCanClick: [],

      loading_data: false,
      detailInfo: {// 兼容，不写默认值报error
        collectionAttrTemplateDTO_convert: {},
        collectionLangVOList_convert: addPlaceholderData({
          colName: '',
          details: '',
          purchaseNotes: '',
          rightsExplain: ''
        })
      },
      options_collectionPurchaseLimit: generateOptionsByMap(booleanStatusMap),
      options_collectionPreSale: generateOptionsByMap(booleanStatusMap),
      loading_submit: false,
      rules_4: {
        preSaleStart: [{required: true, message: '预售开始时间不能为空', trigger: 'change'}]
      },
      // 动态属性列表
      dynamicPropList: [],
      // 多语言列表
      langList: getLangList()
    }
  },
  computed: {
    syncedDrawerVisible: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('update:drawerVisible', val)
      }
    }
  },

  async created() {
    /**获取动态属性列表*/
    let res = await this.$api.get_dynamicProp_list();
    this.dynamicPropList = (res.data || []).map(item => ({
      ...item,
      ...((item.rule && item.rule != ' ') ? JSON.parse(item.rule) : {})
    }))
    // console.log('res.data', res.data);

    /**获取 权益须知与购买须知 默认值*/
    let { data }  = await this.$api.get_allBaseSet_data();
    this.collection_defaultInfo = {};
    for(let i = 0; i < this.langList.length; i ++) {
      this.langList.forEach(item => {
        this.collection_defaultInfo[item.locale] = {};
        this.collection_defaultInfo[item.locale][`collection_purchase_notes_${item.locale}`] = data[`collection_purchase_notes_${item.locale}`]          
        this.collection_defaultInfo[item.locale][`collection_rights_explain_${item.locale}`] = data[`collection_rights_explain_${item.locale}`]          
      })
    }
  },

  watch: {
    drawerVisible(val) {
      if(val) {//打开时
        let placeholder = addPlaceholderData({
          colName: '',
          details: '',
          purchaseNotes: '',
          rightsExplain: ''
        });
        this.langList.forEach(item => {
          placeholder[item.value].purchaseNotes = this.collection_defaultInfo[item.locale][`collection_purchase_notes_${item.locale}`] || '',
          placeholder[item.value].rightsExplain = this.collection_defaultInfo[item.locale][`collection_rights_explain_${item.locale}`] || ''
        })

        if(this.drawerType == 'add') {
          this.detailInfo = {
            colType: 1,//默认藏品类型：虚拟藏品
            recommend: 2,//默认产品推荐：否
            colNature: 1,//默认产品性质: 版权品
            createTime: new Date(parseTime(new Date(), '{y}-{m}-{d}')).getTime(),
            collectionShippingVO: { ...default_collectionShippingVO },
            restricted: 2,//默认藏品限购: 否
            preSale: 2,//默认藏品预售：否
            // ps: 保证vue数据响应
            designerId: undefined,
            seriesId: undefined,
            details: '',
            // 扩展字段 对象
            collectionAttrTemplateDTO_convert: {},
            // 权益须知与购买须知默认值
            rightsExplain: this.collection_rights_explain,
            purchaseNotes: this.collection_purchase_notes,
            // 多语言数据占位
            collectionLangVOList_convert: placeholder,
            
            wide: 0,
            length: 0
          };

        }else {
          this._getCollectionDetailInfo();
        }
      }
    }
  },

  methods: {
    /**获取藏品详细信息*/
    async _getCollectionDetailInfo() {
      this.loading_data = true;
      try{
        let res = await this.$api.get_collection_detailInfo(this.id);
        let data = res.data || {}
        // console.log('data', data);
        // 扩展字段数组 => 对象
        let collectionAttrTemplateDTO_convert = {};
        (res.data.collectionAttrTemplateDTO || []).forEach(item => {
          this.dynamicPropList.forEach(_item => {
            if(item.id == _item.id) {
              if(_item.isPercent) {//小数 => 百分比
                collectionAttrTemplateDTO_convert[_item.attrName] = precisionCalc.mul(item.attrVal || 0, 100);
              }else if(_item.isMinute) {//秒 => 分
                collectionAttrTemplateDTO_convert[_item.attrName] = precisionCalc.div(item.attrVal || 0, 60);
              }else {
                collectionAttrTemplateDTO_convert[_item.attrName] = item.attrVal;
              }
            }
          })
        })
        // console.log('collectionAttrTemplateDTO_convert', collectionAttrTemplateDTO_convert)

        // 多语言数据处理
        let collectionLangVOList_convert = queryDataConvert(res.data.collectionLangVOList);
        // console.log('collectionLangVOList_convert', collectionLangVOList_convert)

        data = { 
          ...data,
          //时间戳单位前端ms,后端s
          createTime: data.createTime * 1000,
          preSaleStart: data.preSaleStart * 1000,
          collectionAttrTemplateDTO_convert,
          collectionLangVOList_convert,
          collectionLangVOList: undefined
        }
        this.detailInfo = data.collectionShippingVO ? data : 
          // 兼容 虚拟藏品 切换为 实物藏品时, 实物藏品特有数据对象不存在的情况
          {
            ...data,
            collectionShippingVO: { ...default_collectionShippingVO }
          }
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
    },

    /**进入步骤*/
    async enterStep(type) {
      if(type == 'next') {
        /**表单校验*/
        if(this.tabActive == '1') {
          let valid = await this.$refs['typeRef'].formValidate();
          if(!valid) { return }
        }else if (this.tabActive == '2') {
          let valid = await this.$refs['infoRef'].formValidate();
          if(!valid) { return }
        } else {
          if(this.$refs['formRef_' + this.tabActive]) {
            let valid = await this.$refs['formRef_' + this.tabActive].validate();
            if(!valid) { return }
          }
        }

        if(this.tabActive == '4') {//最后一步点击下一步：提交
          this._handleSubmit();
          return;
        }

        /**tab是否可点击*/
        this.tabCanClick.push(this.tabActive);
        // ps: 当tabActive == '3'时,同时让'3'和'4'的tab可点击
        this.tabActive == '3' && this.tabCanClick.push('4');

        this.tabActive = String(Number.parseInt(this.tabActive) + 1);
      }else {
        if(this.tabActive == '1') {//第一步点击上一步: return
          return;
        }
        this.tabActive = String(Number.parseInt(this.tabActive) - 1);
      }
    },

    /**提交*/
    async _handleSubmit() {
      this.loading_submit = true;
      try{
        let tipMsg = `${this.drawerType == 'add' ? '添加' : '编辑'}成功！`;

        // 扩展字段对象 => 数组
        let collectionAttrTemplateDTO = this.dynamicPropList.map(item => {
          let attrVal = undefined;
          if(item.isPercent) {//百分比 => 小数
            attrVal = precisionCalc.div(this.detailInfo.collectionAttrTemplateDTO_convert[item.attrName] || 0, 100) || undefined;
          }else if(item.isMinute) {//分 => 秒
            attrVal = precisionCalc.mult(this.detailInfo.collectionAttrTemplateDTO_convert[item.attrName] || 0, 60) || undefined;
          }else {
            attrVal = this.detailInfo.collectionAttrTemplateDTO_convert[item.attrName] || undefined;
          }

          return {
            ...item, 
            attrVal
          }
        })
        collectionAttrTemplateDTO = collectionAttrTemplateDTO.filter(item => item.attrVal);
        // console.log('collectionAttrTemplateDTO', collectionAttrTemplateDTO);
        // console.log('submitDataConvert(this.detailInfo.collectionLangVOList_convert)', submitDataConvert(this.detailInfo.collectionLangVOList_convert))


        await this.$api.add_or_edit_one_collection({
          ...this.detailInfo,
          // 接口字段不统一处理
          collectionShippingDTO: this.detailInfo.collectionShippingVO,
          collectionShippingVO: undefined,
          //时间戳单位前端ms,后端s
          createTime: this.detailInfo.createTime / 1000,
          preSaleStart: this.detailInfo.preSaleStart / 1000,
          // 扩展字段数组
          collectionAttrTemplateDTO,
          // 多语言数据
          collectionLangDTOList: submitDataConvert(this.detailInfo.collectionLangVOList_convert),
        });


        this.loading_submit = false;
        this.closeDrawer();
        this.$message.success(tipMsg);
        // 通知父组件更新数据
        this.$emit('refresh', this.drawerType);
      }catch(e) {
        throw e;
      }finally {
        this.loading_submit = false;
      }
      
    },
    // 关闭drawer
    closeDrawer() {
      // 初始化drawer
      this.tabActive = '1'
      this.tabCanClick = [];
      // 重置表单验证
      this.$refs['typeRef'].resetFormValidate();
      this.$refs['infoRef'].resetFormValidate();
      this.$refs['formRef_3'].clearValidate();
      this.$refs['formRef_4'].clearValidate();

      this.syncedDrawerVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow-y: auto;
  height: calc(100vh - 215px);
}
</style>