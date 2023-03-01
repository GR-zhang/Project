<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(dialogType == 'add' ? '添加' : '编辑') + dialogTopic"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="700px"
  >
    <el-form
      v-loading="loading_data"
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData"
      label-position="left" label-width="95px"
    > 
      <el-form-item 
        label="角色组名称"
        prop="roleName"
        :rules="[{required: true, message: '角色组名称不能为空', trigger: 'blur'}]"
      >
        <el-input v-model="rowData.roleName" placeholder="请输入角色组名称" clearable />
      </el-form-item>
      <el-form-item label="角色组权限">
        <div style="max-height: 500px;overflow: auto;">
          <el-tree
            :data="treeData"
            ref="treeRef"
            :default-expand-all="false"
            show-checkbox
            node-key="menuId"
            :props="{ children: 'child', label: 'menuName'}" />
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="rowData.roleStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="2" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="loading_submit"
        type="primary" @click="_handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import GbInputNumber from '@/components/global/GbInputNumber'

export default {
  name: 'RoleAddOrEditDialog',
  components: {
    GbInputNumber,
  },

  props: {
    // 对话框是否可见
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 对话框类型
    dialogType: {
      type: String,
      required: true
    },
      // 对话框主题
      dialogTopic: {
        type: String,
        default: '[ 主题 ]'
      },
    // 表单数据
    rowData: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      loading_data: false,
      treeData: [],//全部菜单数据
      selIds: [],
      idNode: {},//id对应节点树
      loading_submit: false
    }
  },
  computed: {
    // 双向数据绑定dialogVisible
    syncedDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal);
      }
    },
  },

  watch: {
    async syncedDialogVisible(val) {
      if(val) {
        await this.$nextTick();

        this.loading_data = true;
        try{
          if(this.rowData.roleId) {// 编辑：获取角色组选中的菜单
            let res = await this.$api.get_role_menu(this.rowData.roleId);
            this.selIds = (res.data.roleMenuInsertDTO.menuId || []).map(item => String(item));
            let noHalfIds = this.getNoHalfIds();

            this.$refs.treeRef.setCheckedKeys(noHalfIds);
          }else {//添加：重置tree控件选中数据
            this.$refs.treeRef.setCheckedKeys([]);
          }
        }catch(e) {
          throw e;
        }finally {
          this.loading_data = false;
        }
        
      }
    }
  },

  created() {
    this._getAllMenu();
  },

  methods: {
    /**获取所有菜单*/
    async _getAllMenu() {
      let res = await this.$api.get_allMenu(2);
      this.treeData = res.data;
    },
    // 提交
    _handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try{
            // console.log('this.$refs.treeRef.getHalfCheckedKeys()', this.$refs.treeRef.getHalfCheckedKeys());
            // console.log('this.$refs.treeRef.getCheckedKeys()', this.$refs.treeRef.getCheckedKeys());
            let menuId = [
              ...this.$refs.treeRef.getHalfCheckedKeys(), //半选
              ...this.$refs.treeRef.getCheckedKeys() //全选
            ]
            let data = {
              roleId: this.dialogType == 'add' ? undefined : this.rowData.roleId,
              roleName: this.rowData.roleName,
              roleMenuInsertDTO: {
                menuId,
                roleId: this.rowData.roleId
              },
              roleStatus: this.rowData.roleStatus
            }
            
            let invokeApi = this.dialogType == 'add' ? 
              this.$api.add_or_eidt_one_role
              :
              this.$api.add_or_eidt_one_role;
            let tipMsg = this.dialogType == 'add' ? '添加成功！' : '编辑成功';

            await invokeApi(data);
            
            this.$emit('refresh-table');
            this.$message.success(tipMsg);
            this.syncedDialogVisible = false;
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false
          } 
        }
      })
    },
    // 关闭对话框
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();

      this.syncedDialogVisible = false;
    },
    /**===全选与半选处理===*/
    // 获取非半选的id
    getNoHalfIds() {
      return this.selIds.filter(menuId => {
        this.getIdNodes(menuId, this.treeData);
        // console.log('this.getIdNodes', this.getIdNodes(menuId, this.treeData))
        // console.log('this.idNode', this.idNode)
        let flags = this.notLeafIsSelAll(this.idNode);
        return flags.every(item => item);
      })
    },
    // 获取id对应节点树
    getIdNodes(id, treeData) {
      treeData.forEach(item => {
        if(item.child && item.child.length != 0) {
          this.getIdNodes(id, item.child);
        }

        if(item.menuId == id) {
          this.idNode = item;
        }
      })
    },
    // 非叶子节点是否是 全选状态
    notLeafIsSelAll(notLeafNode) {
      let flags = []

      for (const item of notLeafNode.child) {
        // 递归
        if (item.child && item.child.length != 0) {
          flags = flags.concat(this.notLeafIsSelAll(item))
        }

        if (this.selIds.includes(item.menuId)) {
          flags.push(true);
        }else {
          flags.push(false);
        }
      }

      return flags
    }
  }
}
</script>

<style lang="scss" scoped>

</style>