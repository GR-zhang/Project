<template>
  <el-drawer
    class="airdrop-add-or-edit-drawer"
    :title="(drawerType == 'add' ? '添加' : '编辑') + drawerTopic"
    :visible.sync="syncedDrawerVisible"
    :before-close="handleCloseDialog"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <el-form
      class="backtop1 content-scroll"

      ref="dialogFormRef" style="padding: 0 20px;"
      :model="rowData" :rules="rules"
      label-position="left" label-width="95px"
    > 
      <MultiLangForm ref="multiLangFormRef" :detail-info="rowData" :drawer-type="drawerType" />
      <el-form-item label="空投方式">
        <el-radio-group v-model="rowData.activityMode">
          <el-radio
            v-for="item in options_airdropMethod" :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 2" label="会员等级" prop="userLevel" :key="2">
        <gb-select-api v-model="rowData.userLevel" placeholder="请选择会员等级"
          :apiFunc="$api.get_memberRank_list" :props="{label: 'levelName', value: 'leveId'}"  />
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 3" label="白名单" prop="whiteId" :key="3">
        <gb-select-api v-model="rowData.whiteId" placeholder="请选择白名单"
          :apiFunc="$api.get_whitelist_list" :props="{label: 'name', value: 'id'}"  />
      </el-form-item>
      <el-form-item label="空投内容" prop="collectionDTOList">
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary" size="mini"
          @click="drawerVisible_nested = true;">添加</el-button>
        <el-table :data="rowData.collectionDTOList" v-loading="loading_table">
          <el-table-column label="藏品名称" prop="colName" min-width="100" />
          <el-table-column label="首发剩余库存" prop="stock" min-width="100" />
          <el-table-column label="空投数量" width="200">
            <template v-slot="{ row }">
              <gb-input-number limit-type="integer" v-model="row.num" placeholder="请输入" unit="个" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" align="center">
            <template v-slot="{ $index }">
              <el-button type="text" class="text_red" @click="
                rowData.collectionDTOList.splice($index, 1);
                $refs['dialogFormRef'].validateField('collectionDTOList');
              ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 抽屉【藏品选择】 -->
        <collection-multi-select-drawer
          :visible.sync="drawerVisible_nested"
          title="藏品选择"
          :active-rows="rowData.collectionDTOList"
          :active-ids="cpt_activeIds"
          @sel-row="handleSelRow" />
      </el-form-item>

      <!-- 返回顶部 -->
      <el-backtop target=".backtop1" />
    </el-form>
    <div class="drawer-operation-btn">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading" :disabled="loading_table"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { airdropMethodMap, generateOptionsByMap  } from '@/config'
import { queryDataConvert } from '@/utils/lang-data-hanlde'

import { CollectionMultiSelectDrawer } from '@/components/business'
import { GbSelectApi } from '@/components/global'
import MultiLangForm from './MultiLangForm.vue'

export default {
  name: 'AirdropAddOrEditDrawer',
  components: { CollectionMultiSelectDrawer, GbSelectApi, MultiLangForm },

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
    // 抽屉表单参数对象
    rowData: {
      type: Object,
      required: true
    },
    // 提交loading
    submitLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var checkCollectionDTOList = (rule, value, callback) => {    
      value.some(item => !item.num) ? callback(new Error('空投数量列不能为空或等于0')) : callback();    
    };

    return {
      options_airdropMethod: generateOptionsByMap(airdropMethodMap),
      rules: {
        userLevel: [{required: true, message: '会员等级不能为空', trigger: 'blur'}],
        whiteId: [{required: true, message: '白名单不能为空', trigger: 'blur'}],
        collectionDTOList: [
          {required: true, message: '空投内容不能为空', trigger: 'blur'},
          {validator: checkCollectionDTOList, trigger: 'change'}
        ]
      },
      loading_table: false,
      // 嵌套抽屉
      drawerVisible_nested: false
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
    // 已选中会员id数组
    cpt_activeIds() {
      return this.rowData.collectionDTOList.map(item => item.colId)
    }
  },

  watch: {
    syncedDrawerVisible(val) {
      (val && this.drawerType == 'edit') && this._getList();
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
    /**获取空投详情*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_airdrop_detailInfo(this.rowData.activityId)
        this.$parent.rowData = {
            ...res.data,
            // 多语言处理
            'activityAirdropLangPOList_convert': queryDataConvert(res.data.activityAirdropLangPOList),
            activityAirdropLangPOList: undefined,
            whiteId: String(res.data.whiteId)//兼容：后端返回number，与查询数据string对不上 
          } || {};
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    },
    /**选中一行*/
    handleSelRow(row) {
      let index = this.rowData.collectionDTOList.findIndex(item => item.colId == row.colId);
      if(index !== -1) {//选中旧行,splice
        this.rowData.collectionDTOList.splice(index, 1);
      }else {//选中新行,push
        this.rowData.collectionDTOList.push(row);
      }

      this.$refs['dialogFormRef'].validateField('collectionDTOList');
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