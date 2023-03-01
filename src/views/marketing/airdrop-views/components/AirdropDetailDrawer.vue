<template>
  <el-drawer
    class="airdrop-add-or-edit-drawer"
    :title="title"
    :visible.sync="syncedVisible"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px;"
      :model="rowData"
      label-position="left" label-width="95px"
    > 
      <el-form-item label="空投名称" prop="activityName">
        <el-input v-model="rowData.activityName" placeholder="请输入空投名称" clearable disabled />
      </el-form-item>
      <el-form-item label="空投方式">
        <el-radio-group v-model="rowData.activityMode" disabled>
          <el-radio
            v-for="item in options_airdropMethod" :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 2" label="会员等级" prop="userLevel" :key="2">
        <gb-select-api v-model="rowData.userLevel" placeholder="请选择会员等级" disabled
          :apiFunc="$api.get_memberRank_list" :props="{label: 'levelName', value: 'leveId'}"  />
      </el-form-item>
      <el-form-item v-if="rowData.activityMode == 3" label="白名单" prop="whiteId" :key="3">
        <gb-select-api v-model="rowData.whiteId" placeholder="请选择白名单" disabled
          :apiFunc="$api.get_whitelist_list" :props="{label: 'name', value: 'id'}"  />
      </el-form-item>
      <el-form-item label="空投内容" prop="collectionDTOList">
          <div class="backtop1 content-scroll">
            <el-table :data="rowData.collectionDTOList" v-loading="loading_table">
              <el-table-column label="藏品名称" prop="colName" min-width="200" />
              <el-table-column label="空投数量" min-width="200">
                <template v-slot="{ row }">
                  <gb-input-number limit-type="integer" v-model="row.num" placeholder="请输入" unit="个" disabled />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 返回顶部 -->
          <el-backtop target=".backtop1" />
      </el-form-item>
    </el-form>
    <div class="drawer-operation-btn">
      <el-button @click="syncedVisible = false" size="medium">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { airdropMethodMap, generateOptionsByMap  } from '@/config'

import { GbSelectApi } from '@/components/global'

export default {
  name: 'AirdropDetailDrawer',
  components: { GbSelectApi },

  props: {
    // 是否可见
    visible: {
      type: Boolean,
      required: true
    },
    // 标题
    title: {
      type: String,
      required: true
    },
    // 表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options_airdropMethod: generateOptionsByMap(airdropMethodMap),
      loading_table: false
    }
  },
  computed: {
    // 双向数据绑定visible
    syncedVisible: {
      get() {
        return this.visible;
      },
      set(newVal) {
        this.$emit('update:visible', newVal);
      }
    }
  },

  watch: {
    syncedVisible(val) {
      val && this._getList();
    }
  },

  methods: {
    /**获取空投详情*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_airdrop_detailInfo(this.rowData.activityId);
        this.$parent.rowData_detail = 
          {
            ...res.data,
            whiteId: String(res.data.whiteId)//兼容：后端返回number，与查询数据string对不上
          } || {};
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-scroll {
  overflow-y: auto;
  height: calc(100vh - 310px);
}
</style>