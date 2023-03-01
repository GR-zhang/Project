<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="finnalTitle"
    :visible.sync="syncedDialogVisible"
    :before-close="handleCloseDialog"

    width="650px"
  >
    <el-form
      ref="dialogFormRef" style="padding: 0 20px"
      :model="rowData" :rules="rules"
      label-position="left" label-width="100px"
    > 
      <!-- 添加子路由显示 -->
      <el-form-item v-if="['addSon', 'addBtn'].includes(dialogType)" label="父级路由标题">
        {{ rowData.parentMenuName }}
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <gb-input-number limit-type="integer" v-model="rowData.sort" />
      </el-form-item>
      <el-form-item label="路由路径" prop="menuPath">
        <el-input v-model="rowData.menuPath" placeholder="请输入路由路径" clearable />
        <div class="form_control_tip">路由时指 路由路径，按钮时 值接口路径</div>        
      </el-form-item>

      <!-- 非添加按钮显示 -->
      <el-form-item v-if="dialogType != 'addBtn' && rowData.menuType != 3" label="组件路径" prop="component">
        <el-input v-model="rowData.component" placeholder="请输入组件路径" clearable />
      </el-form-item>
      
      <el-form-item label="路由名称" prop="menuRoute">
        <el-input v-model="rowData.menuRoute" placeholder="请输入路由名称" clearable />
        <div class="form_control_tip">路由格式如：MemberMng，按钮格式：member-mng#query</div>    
      </el-form-item>
      <el-form-item label="路由标题" prop="menuName">
        <el-input v-model="rowData.menuName" placeholder="请输入路由标题" clearable />
      </el-form-item>

      <!-- 非添加按钮显示 -->
      <template v-if="dialogType != 'addBtn' && rowData.menuType != 3">
        <!-- 添加或编辑根菜单才显示图标 -->
        <el-form-item v-if="dialogType == 'addRoot' || rowData.menuType == 1" label="路由图标" prop="icon">
          <el-input v-model="rowData.icon" placeholder="请输入路由图标" clearable />
          <div class="form_control_tip">图标名称来自 @/icons/svg/ 下的svg</div>        
        </el-form-item>
        <el-form-item label="重定向地址" prop="superRedirect">
          <el-input v-model="rowData.superRedirect" placeholder="请输入重定向地址" clearable />
          <div class="form_control_tip">与 菜单的active状态 和 重定向 相关</div>        
        </el-form-item>
      </template>
    </el-form>

    <!-- <el-divider content-position="left">路由配置与页面对应关系</el-divider>
    <pre>
      {
        menuPath: '/marketing',// 路由路径
        component: Layout,// 组件路径
        menuRoute: 'Marketing',// 路由名称
        meta: {
          menuName: '营销推广',// 路由标题
          icon: 'huodong',// 路由名称(根路由才需要)
          superRedirect: 'marketing'// 重定向地址
        },
        children: []
      }
    </pre> -->
    
    <span slot="footer">
      <el-button @click="handleCloseDialog" size="medium">取消</el-button>
      <el-button
        :loading="loading_submit"
        type="primary" @click="handleSubmit" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  menuRoute: 'RouteAddOrEditDialog',

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
    // 对话框表单参数对象
    rowData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
        menuPath: [{required: true, message: '路由路径不能为空', trigger: 'blur'}],
        component: [{required: true, message: '组件路径不能为空', trigger: 'blur'}],
        menuRoute: [{required: true, message: '路由名称不能为空', trigger: 'blur'}],
        menuName: [{required: true, message: '路由标题不能为空', trigger: 'blur'}],
        icon: [{required: true, message: '路由图标不能为空', trigger: 'blur'}],
        superRedirect: [{required: true, message: '重定向地址不能为空', trigger: 'blur'}]
      },

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
    finnalTitle() {
      let titleMapObj = {
        'addRoot': '添加根路由',
        'addSon': '添加子路由',
        'addBtn': '添加按钮',
        'edit': '编辑路由'
      }

      return titleMapObj[this.dialogType]
    }
  },

  methods: {
    // 提交
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async valid => {
        if(valid) {
          this.loading_submit = true;
          try{
            if(this.dialogType == 'addRoot') {//添加根路由
              await this.$api.add_one_RootMenu(this.rowData);
            }else if(this.dialogType == 'edit') {//编辑路由
              await this.$api.edit_one_menu(this.rowData);
            }else {//添加子路由或按钮
              await this.$api.add_one_sonMenu(this.rowData);
            }
            this.$emit('refresh')
            this.syncedDialogVisible = false;
            this.$message.success('编辑成功！');
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }else {
          return false;
        }
      })
    },
    // 关闭对话框
    handleCloseDialog() {
      // 重置表单校验
      this.$refs.dialogFormRef.clearValidate();

      this.syncedDialogVisible = false;
    }
  }
}
</script>

<style lang="scss">

</style>