<template>
  <el-drawer
    class="synthesis-combo-add-or-edit-drawer"
    :title="cpt_finnalTitle"
    :visible.sync="syncedDrawerVisible"
    :before-close="handleCloseDialog"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <div class="backtop1 content-scroll" v-loading="loading_data">
      <el-form
        ref="dialogFormRef" style="padding: 0 20px;"
        :model="detailInfo" :rules="rules"
        label-position="left" label-width="140px"
      >
        <MultiLangForm ref="multiLangFormRef" :detail-info="detailInfo" :drawer-type="drawerType" />
        <el-form-item label="合成套餐主图" prop="activityImage">
          <uploader-single-file
            :disabled="drawerType == 'detail'"
            :file-url.sync="detailInfo.activityImage" 
            :uploadAreaSize="{width: '150px', height: '150px'}" iconSize="small"
            @verify="$refs['dialogFormRef'].validateField('activityImage')" ratio="130*130px" />
        </el-form-item>
        <el-form-item label="合成目标" prop="targetColId">
          <el-button
            :disabled="drawerType == 'detail'"
            size="mini" type="info" 
            @click="dialogVisible_nested_collection = true;">选择</el-button>
          <div>
            藏品名称:&nbsp;&nbsp;
            <el-tag type="danger" effect="plain">{{ detailInfo.targetColName ? detailInfo.targetColName : '暂未选择' }}</el-tag>
          </div>
          <div>
            藏品ID:&nbsp;&nbsp;
            <el-tag type="danger" effect="plain">{{ detailInfo.targetColId ? detailInfo.targetColId : '暂未选择' }}</el-tag>
          </div>

          <!-- 对话框【藏品选择】 -->
          <collection-select-dialog
            :dialog-visible.sync="dialogVisible_nested_collection"
            dialog-title="藏品选择"
            :active-id="detailInfo.targetColId"
            @sel-one="(row) => {
              detailInfo.targetColId = row.colId;
              detailInfo.targetColName = row.colName;
              detailInfo.residualStock = row.stock;
              $refs.dialogFormRef.validateField('targetColId');
            }" />
        </el-form-item>
        <el-form-item label="限制合成数量" prop="limitSynthesizedQuantity">
          <gb-input-number
            limit-type="integer" :disabled="drawerType == 'detail'"
            v-model="detailInfo.limitSynthesizedQuantity" placeholder="请输入限制合成数量" unit="个" />
          <div class="form_control_tip">首发剩余库存 {{ detailInfo.residualStock || 0 }} 个</div>
        </el-form-item>
        <el-form-item label="初始素材转移账户" prop="receiveUserId">
          <el-button
            :disabled="drawerType == 'detail'"
            size="mini" type="info" 
            @click="dialogVisible_nested_member = true;">选择</el-button>
          <div>
            会员昵称:&nbsp;&nbsp;
            <el-tag type="danger" effect="plain">{{ detailInfo.receiveUserNickname ? detailInfo.receiveUserNickname : '暂未选择' }}</el-tag>
          </div>
          <div>
            会员ID:&nbsp;&nbsp;
            <el-tag type="danger" effect="plain">{{ detailInfo.receiveUserId ? detailInfo.receiveUserId : '暂未选择' }}</el-tag>
          </div>

          <!-- 对话框【会员选择】 -->
          <memeber-select-dialog
            :dialog-visible.sync="dialogVisible_nested_member"
            dialog-title="会员选择"
            :active-id="detailInfo.receiveUserId"
            containCreater
            @sel-one="(row) => {
              detailInfo.receiveUserId = row.uid;
              detailInfo.receiveUserNickname = row.nickName;
              $refs.dialogFormRef.validateField('receiveUserId');
            }" />
        </el-form-item>
        <el-form-item label="开始-结束时间" prop="datetimeRange">
          <gb-picker-datetime-range
            :disabled="drawerType == 'detail'"
            v-model="detailInfo.datetimeRange" :collect-params-obj="detailInfo"
            :assignFields="['startTime', 'endTime']" />
        </el-form-item>
        <el-form-item label="初始合成款式" prop="materialsList">
          <synthesis-table
            :key="drawerType"
            :table-list.sync="detailInfo.materialsList"
            :target-col-id="detailInfo.targetColId"
            :drawer-type="drawerType"
            @verify="$refs['dialogFormRef'].validateField('materialsList')" />
        </el-form-item>
      </el-form>
          
      <!-- 返回顶部 -->
      <el-backtop ref="backTopRef" target=".backtop1" />
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
import { parseTime } from '@/utils'
import { tableRowContainNull } from './utils'
import { queryDataConvert, addPlaceholderData, submitDataConvert } from '@/utils/lang-data-hanlde'

import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import { GbPickerDatetimeRange } from '@/components/global'
import { CollectionSelectDialog, MemeberSelectDialog } from '@/components/business'
import SynthesisTable from './SynthesisTable'
import MultiLangForm from './MultiLangForm.vue'

export default {
  name: 'SynthesisComboAddOrEditDrawer',
  components: { 
    UploaderSingleFile,
    GbPickerDatetimeRange,
    CollectionSelectDialog,
    MemeberSelectDialog,
    SynthesisTable,
    MultiLangForm
  },

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
    var checkMaterialsList = (rule, value, callback) => {    
      if(tableRowContainNull(value)) {
        callback(new Error('请完善表格每一行数据再提交！'));
      }else {
        callback();
      }
    };

    return {
      // 表单
      options_airdropMethod: generateOptionsByMap(airdropMethodMap),
      rules: {
        activityImage: [{required: true, message: '合成套餐主图不能为空', trigger: 'blur'}],
        targetColId: [{required: true, message: '合成目标不能为空', trigger: 'change'}],
        limitSynthesizedQuantity : [{required: true, message: '限制合成数量不能为空', trigger: 'blur'}],
        receiveUserId: [{required: true, message: '合成目标不能为空', trigger: 'change'}],
        datetimeRange: [{required: true, message: '开始-结束时间不能为空', trigger: 'blur'}],
        materialsList: [
          {required: true, message: '初始合成款式不能为空', trigger: 'change'},
          {validator: checkMaterialsList, trigger: 'blur'}
        ]
      },
      // 内嵌对话框
      dialogVisible_nested_collection: false,
      dialogVisible_nested_member: false,

      // 表格
      detailInfo: {
        boxName: undefined,
        
        materialsList: [],
        synthesizeLangPOS_convert: addPlaceholderData({
          activityName: '',
          activityDescription: ''
        }),
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
    // 最终标题
    cpt_finnalTitle() {
      if(this.drawerType == 'detail') {
        return '合成套餐详情';
      }
      return (this.drawerType == 'add' ? '添加' : '编辑') + this.drawerTopic;
    }
  },

  watch: {
    syncedDrawerVisible(val) {
      if(val) {
        // 返回顶部
        this.$refs['backTopRef'] && this.$refs['backTopRef'].scrollToTop();
        if(this.drawerType == 'add') {
          this.detailInfo = {
            targetColId: '',// ps: 不加表单主动校验失效
            receiveUserId: '',// ps: 不加表单主动校验失效
            materialsList: [],
            datatimeRange: [],
            synthesizeLangPOS_convert: addPlaceholderData({
              activityName: '',
              activityDescription: ''
            }),
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
      // 校验多语言表单
      let flag = await this.$refs['multiLangFormRef'].formValidate();
      if(!flag) { return };

      this.$refs.dialogFormRef.validate(valid => {
        if(valid) {
          this.syncedSubmitLoading = true;
          this.$emit('submit');
        }else {
          return false;
        }
      })
    },
    // 关闭抽屉
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();
      
      this.syncedDrawerVisible = false;
    },
    /**获取合成套餐详情*/
    async _getList() {
      this.loading_data = true;
      try{
        let res = await this.$api.get_systhesisCombo_detailInfo(this.id);
        // 多语言数据处理
        let synthesizeLangPOS_convert = queryDataConvert(res.data.synthesizeLangPOS);
        // console.log('synthesizeLangPOS_convert', synthesizeLangPOS_convert)
        this.detailInfo = {
          ...res.data || {},
          synthesizeLangPOS_convert,
          synthesizeLangPOS: undefined,
          // 时间处理
          'datetimeRange': [parseTime(res.data.startTime * 1000), parseTime(res.data.endTime * 1000)]
        };
      }catch(e) {
        throw e;
      }finally {
        this.loading_data = false;
      }
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