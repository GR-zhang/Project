<template>
  <div class="edit-table">
    <el-button
      icon="el-icon-edit"
      type="primary" size="small"
      @click="handleAddRow">添加</el-button>
    <el-table :data="tableData">
      <el-table-column label="拍卖次数">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.isEdit"
            type="number" min="0"
            v-model.number="row.count"
            clearable placeholder="请输入拍卖次数" />
          <span v-else>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赔付金额/元">
        <template slot-scope="{ row }">
          <el-input
            v-if="row.isEdit"
            type="number" min="0"
            v-model.number="row.money"
            clearable placeholder="请输入赔付金额/元" />
          <span v-else>{{ row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="{ row, $index  }">
          <el-button type="text" @click="handleEditRow(row)">
            {{ row.isEdit ? '确定' : '编辑' }}
          </el-button>

          <el-button type="text" class="text-red" @click="handleDelRow($index, row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EditTable',

  props: {
    // 父级id
    parentId: {
      type: Number
    },
    // 表格数据
    tableData: {
      type: Array,
      required: true
    },
    // rowData，传递过来是为了把编辑已存在但是删除数据id  push到 deleteIds数组
    rowData: {
      type: Object
    }
  },
  data() {
    return {

    };
  },
  computed: {
    syncedTableData: {
      get() {
        return this.tableData;
      },
      set(vals) {
        this.$emit('update:tableData', vals);
      }
    }
  },

  methods: {
    /**添加一行*/
    handleAddRow() {
      let haveEidtRow = this.syncedTableData.some((item, index) => {
        return item.isEdit
      })

      haveEidtRow ?
        this.$message.info('请完成编辑中数据，再添加！')
        :
        this.syncedTableData.push({
          setmealId: this.parentId,
          count: undefined,
          money: undefined,
          isEdit: true
        })
    },
    /**编辑一行*/
    handleEditRow(row) {
      if(row.isEdit) {//编辑中【确定按钮】
        let notNullValue = Object.keys(row).every((item, index) => {
          if(item == 'setmealId') {
            return true
          };
          return row[item]; //对象每一个属性不能为空
        })

        notNullValue ? row.isEdit = false : this.$message.info('每一条数据都不能有空值！');
      }else {//启用编辑【编辑按钮】
        row.isEdit = true;
      }
    },
    /**删除一行*/
    handleDelRow(index, row) {
      if(row.id) {// 有id存在，才是编辑中就存在的数据
        this.rowData.deleteIds.push(row.id);
      }

      this.syncedTableData.splice(index, 1);
      this.$emit('verify');//表单主动验证
    }
  }
}
</script>

<style>

</style>