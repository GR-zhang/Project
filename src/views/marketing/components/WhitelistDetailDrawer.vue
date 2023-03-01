<template>
  <el-drawer
    class="whitelist-add-or-edit-drawer"
    :title="title"
    :visible.sync="syncedVisible"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px;"
      :model="rowData"
      label-position="left" label-width="95px"
    > 
      <el-form-item label="白名单名称" prop="name">{{ rowData.name }}</el-form-item>
      <el-form-item label="白名单描述" prop="description">{{ rowData.description }}</el-form-item>
      <el-form-item label="白名单会员" prop="userInfoVOS">
          <div class="backtop1 content-scroll">
            <el-table :data="rowData.userInfoVOS" v-loading="loading_table">
              <el-table-column label="序号" min-width="70">
                <template v-slot="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column label="会员昵称" prop="nickName" min-width="100" />
              <el-table-column label="手机号码" prop="phone" min-width="100" />
            </el-table>
          </div>
          <!-- 返回顶部 -->
          <el-backtop ref="backtopRef" target=".backtop1" />
          <gb-pagination
            :page.sync="pageParams.pageNum"
            :limit.sync="pageParams.pageSize"
            :total="total"
            @pagination="_getList();_getList();$refs['backtopRef'].scrollToTop()" />
      </el-form-item>
    </el-form>
    <div class="drawer-operation-btn">
      <el-button @click="syncedVisible = false" size="medium">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { sharedPageParams } from '@/mixins'

export default {
  name: 'WhitelistDetailDrawer',

  props: {
    // 是否可见
    visible: {
      type: Boolean,
      required: true
    },
    // 标题
    title: {
      type: String,
      default: '[ 标题 ]'
    },
    // 抽屉表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pageParams: { ...sharedPageParams },
      loading_table: false,
      total: 0
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
    },
    // 已选中会员id数组
    cpt_activeIds() {
      return this.rowData.userInfoVOS.map(item => item.uid)
    }
  },

  watch: {
    syncedVisible(val) {
      if(val) {
        this._getList();
      }else {
        this.pageParams = { ...sharedPageParams };//重置分页参数
      }
    }
  },

  methods: {
    /**获取白名单下的会员*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_whitelisted_members({
          whitelistId: this.rowData.id,
          ...this.pageParams
        })
        this.rowData.userInfoVOS = res.data.rows || [];
        this.total = Number.parseInt(res.data.total);
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
  height: calc(100vh - 300px);
}
</style>