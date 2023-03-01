<template>
  <div class="member-mng-container">
    <!-- 表单 -->
    <div class="form_card">
      <div class="mb_10">
        <el-button size="mini" type="primary" @click="openAddOrEditDialog('add')">添加会员</el-button>
        <el-button size="mini" type="primary" :loading="loading_export" @click="_handleExport">导出</el-button>
      </div>
      <gb-form-query
        :queryParams="queryParams"
        :queryFormItems="queryFormItems"
        @search-btn-click="filterQuery"
        @reset-btn-click="resetQuery"
        @text-input-keyup-enter="filterQuery" />
    </div>
    <!-- 表格 -->
    <div class="table_card">
      <gb-table-display
        :table-loading="loading_table"
        :table-columns="tableColumns"
        :table-list="tableList"
      >
        <template v-slot="{ row }">
          <el-button class="text_green" type="text" @click="openRechargeDialog(row)">充值</el-button>
          <el-button type="text" @click="openAddOrEditDialog('edit', row)">编辑</el-button>
        </template>
      </gb-table-display>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>
    <!-- 对话框【充值】 -->
    <gb-add-and-edit-dialog
      :dialog-visible.sync="dialogVisible_recharge"
      dialog-custom-title="充值"
      :row-data="rowData_recharge"
      :modal-form-items="modalFormItems_recharge"
      :submit-loading.sync="loading_submit_recharge"
      @submit="_handleSubmit_recharge"
      
      width="600px" />
    <!-- 对话框【编辑】 -->
    <gb-add-and-edit-dialog
      :dialog-visible.sync="dialogVisible"
      dialog-topic="会员" :dialog-type="dialogType"
      :row-data="rowData"
      :modal-form-items="cpt_modalFormItems"
      :submit-loading.sync="loading_submit"
      @submit="_handleSubmit"
      
      width="600px"
      formLabelWidth="100px" />
  </div>
</template>

<script>
import commonMixins,{ sharedPageParams, tools } from '@/mixins'
import { booleanStatusMap, userStatusMap, rechargeTypeMap, generateOptionsByMap, multiTagInfo } from '@/config'

// 初始化查询参数
const initialQueryParams = {
  nickName: '',
  userName: '',//手机号码
  isDesigner: undefined,
}

export default {
  name: 'MemberMng',
  mixins: [commonMixins],

  data() {
    return {
      // 表单
      queryParams: { ...initialQueryParams },
      pageParams: { ...sharedPageParams },
      queryFormItems: [
        {label: '会员昵称', prop: 'nickName'},
        {label: '手机号码', prop: 'userName'},
        {
          type: 'select',
          label: '创作者',
          prop: 'isDesigner',

          options: generateOptionsByMap(booleanStatusMap)
        }
      ],
      loading_export: false,
      // 表格
      tableColumns: [
        {label: '会员ID', prop: 'uid', minWidth: 140},
        {label: '会员昵称', prop: 'nickName', minWidth: 150},
        {label: '当前余额', prop: 'balance', minWidth: 100},
        {label: '手机号码', prop: 'userName', minWidth: 100},
        {
          type: 'img',
          label: '会员头像', 
          prop: 'head', 
          minWidth: 110
        },
        {label: '实名制名称', prop: 'identityName', minWidth: 150},
        {label: '会员等级', prop: 'levelName', minWidth: 120},
        {
          type: 'multi-tag',
          label: '创作者',
          prop: 'applyStatus', 
          minWidth: 90,
          
          multiTagInfo: multiTagInfo.booleanStatus
        },
        {
          type: 'multi-tag',
          label: '状态',
          prop: 'userStatus', 
          minWidth: 90,
          
          multiTagInfo: multiTagInfo.userStatus
        },
        {
          type: 'timestamp',
          label: '注册时间',
          prop: 'createTime',
          minWidth: 140
        }
      ],
      // 对话框【充值】
      dialogVisible_recharge: false,
      loading_submit_recharge: false,
      rowData_recharge: {},
      modalFormItems_recharge: [
        {label: '当前余额', prop: 'balance', disabled: true},
        {
          type: 'radio',
          label: '充值类型',
          prop: 'type',
          options: generateOptionsByMap(rechargeTypeMap)
        },
        {
          type: 'gb-input-number',
          label: '充值数目',
          prop: 'money',
          required: true,
          
          unit: '元'
        },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remarks'
        }
      ]
    }
  },
  computed: {
    cpt_modalFormItems() {
      let disabled = this.dialogType == 'edit';
      let required = this.dialogType == 'add';
      
      let config  = [
        {label: '会员昵称', prop: 'nickName', required, disabled},
        {label: '手机号码', prop: 'userName', required, regExp: 'phone', disabled},
        {
          type: 'single-img-upload',
          label: '会员头像',
          prop: 'head',
          required,
          disabled,

          uploadAreaSize: {width: '150px', height: '150px'},
          imgFit: 'cover', iconSize: 'small', ratio: '130*130px'
        },
        {label: '登陆密码', prop: 'pwd',  isPwdInput: true, required, disabled},
        {label: '交易密码', prop: 'transPwd',  isPwdInput: true, required, disabled},
        {
          type: 'radio',
          label: '状态', 
          prop: 'userStatus',

          options: generateOptionsByMap(userStatusMap)
        }
      ]
      if(this.dialogType == 'edit') {// 编辑时，展示
        config.splice(3, 0, {label: '实名制名称', prop: 'identityName', disabled},)
      }
      
      return config;
    } 
  },

  methods: {
    /**获取会员列表*/
    async _getList() {
      tools.setData(this, async () => {
        let res = await this.$api.get_memberMng_list({
          data: this.queryParams,
          params: this.pageParams,
        });
        res.data.rows = (res.data.rows || []).map(item => ({
          ...item,
          // ps: applyStatus=2是创作者,其他都不是
          applyStatus: item.applyStatus == '2' ? 1 : 2
        }));
        return res;
      })
    },
    resetQuery() {
      this.pageParams = { ...sharedPageParams };
      this.queryParams = { ...initialQueryParams };

      this._getList();
    },
    /**打开对话框【充值】*/
    async openRechargeDialog(row) {
      this.rowData_recharge = {
        uid: row.uid,
        balance: row.balance,
        type: 1,//默认充值类型: 增加
        money: undefined,
        remarks: ''
      }

      await this.$nextTick();
      this.dialogVisible_recharge = true;
    },
    async _handleSubmit_recharge() {
      try{
        await this.$api.balance_recharge(this.rowData_recharge);
        this.loading_submit_recharge = false;
        this.dialogVisible_recharge = false,
        this.$message.success('充值成功！');
        this._getList();
      }catch(e) {
        this.loading_submit_recharge = false;
        throw e;
      }
    },
    /**打开对话框【编辑】*/
    async openAddOrEditDialog(type, row) {
      if(type == 'add') {
        this.rowData = {
          userStatus: 1,//默认状态：开启
        };
      }else {
        this.rowData = { ...row };
      }

      this.dialogType = type;
      await this.$nextTick();
      this.dialogVisible = true;
    },
    _handleSubmit() {
      tools.submitOne(this, {
        apiFuncs: [this.$api.add_one_memberMng, this.$api.edit_one_memberMng],
        data: this.rowData
      })
    },
    /**导出*/
    _handleExport() {
      tools.exportExcel(this, {
        apiFunc: this.$api.export_memberMng,
        data: this.queryParams,
        fileName: '会员管理'
      })
    }
  }
  
}
</script>

<style lang="scss" scoped>

</style>