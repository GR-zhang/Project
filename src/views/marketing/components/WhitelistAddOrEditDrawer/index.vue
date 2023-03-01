<template>
  <el-drawer
    class="whitelist-add-or-edit-drawer"
    :title="(drawerType == 'add' ? '添加' : '编辑') + drawerTopic"
    :visible.sync="syncedDrawerVisible"
    :before-close="handleCloseDialog"

    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px;"
      :model="rowData" :rules="rules"
      label-position="left" label-width="95px"
    > 
      <el-form-item label="白名单名称" prop="name">
        <el-input v-model="rowData.name" placeholder="请输入白名单名称" clearable />
      </el-form-item>
      <el-form-item label="白名单描述" prop="description">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入白名单描述"
          v-model="rowData.description">
        </el-input>
      </el-form-item>
      <el-form-item label="白名单会员" prop="userInfoVOS">
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary" size="mini"
          @click="drawerVisible_nested = true;">添加</el-button>
          <div class="backtop1 content-scroll">
            <el-table :data="rowData.userInfoVOS" v-loading="loading_table">
              <el-table-column label="序号" min-width="70">
                <template v-slot="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column label="会员昵称" prop="nickName" min-width="100" />
              <el-table-column label="手机号码" prop="phone" min-width="100" />
              <el-table-column label="操作" min-width="80" align="center">
                <template v-slot="{ $index }">
                  <el-button type="text" class="text_red" @click="
                    rowData.userInfoVOS.splice($index, 1);
                    $refs['dialogFormRef'].validateField('userInfoVOS');
                  ">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 返回顶部 -->
          <el-backtop target=".backtop1" />
        <!-- 抽屉【会员选择】 -->
        <memeber-multi-select-drawer
          :visible.sync="drawerVisible_nested"
          title="会员选择"
          :active-rows="rowData.userInfoVOS"
          :active-ids="cpt_activeIds"
          @sel-row="handleSelRow" />
      </el-form-item>
    </el-form>
    <div class="drawer-operation-btn">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="syncedSubmitLoading"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import MemeberMultiSelectDrawer from './MemeberMultiSelectDrawer'

export default {
  name: 'WhitelistAddOrEditDrawer',
  components: {MemeberMultiSelectDrawer},

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
    return {
      rules: {
        name: [{required: true, message: '白名单名称不能为空', trigger: 'blur'}],
        description: [{required: true, message: '白名单描述不能为空', trigger: 'blur'}],
        userInfoVOS: [{required: true, message: '白名单会员不能为空', trigger: 'blur'}]
      },
      loading_table: false,
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
      return this.rowData.userInfoVOS.map(item => item.uid)
    }
  },

  watch: {
    syncedDrawerVisible(val) {
      (val && this.drawerType == 'edit') && this._getList();
    }
  },

  methods: {
    // 提交
    handleSubmit() {
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
    /**获取白名单下的会员*/
    async _getList() {
      this.loading_table = true;
      try{
        let res = await this.$api.get_whitelisted_members({
          whitelistId: this.rowData.id,
          pageNum: 1,
          pageSize: 999
        })
        this.rowData.userInfoVOS = res.data.rows || [];
      }catch(e) {
        throw e;
      }finally {
        this.loading_table = false;  
      }
    },
    /**选中一行*/
    handleSelRow(row) {
      let index = this.rowData.userInfoVOS.findIndex(item => item.uid == row.uid);
      if(index !== -1) {//选中旧行,splice
        this.rowData.userInfoVOS.splice(index, 1);
      }else {//选中新行,push
        this.rowData.userInfoVOS.push(row);
      }

      this.$refs['dialogFormRef'].validateField('userInfoVOS');
    }
  }
}
</script>

<style lang="scss" scoped>
.content-scroll {
  overflow-y: auto;
  height: calc(100vh - 350px);
}
</style>