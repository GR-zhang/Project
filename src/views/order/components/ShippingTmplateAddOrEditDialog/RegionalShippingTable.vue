<template>
  <div class="edit-table">
    <el-button
      icon="el-icon-circle-plus-outline"
      type="primary" size="mini"
      @click="handleAddRow">添加</el-button>
    <el-table :data="syncedTableData">
      <el-table-column label="配送区域" width="215px">
        <template slot-scope="{ row }">
          <multi-select-area-city v-model="row.regions" :disabled="!row.isEdit" />
        </template>
      </el-table-column>
      <el-table-column :label="billingMethod == 1 ? '首件(件)' : '首重(kg)'">
        <template slot-scope="{ row }">
          <gb-input-number 
            v-if="row.isEdit"
            :limit-type="billingMethod == 1 ? 'integer' : 'float'" v-model="row.first"
            placeholder="请输入" clearable />
          <span v-else>{{ row.first }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费(元)">
        <template slot-scope="{ row }">
          <gb-input-number 
            v-if="row.isEdit" v-model="row.firstFee"
            placeholder="请输入" clearable />
          <span v-else>{{ row.firstFee }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="billingMethod == 1 ? '续件(件)' : '续重(kg)'">
        <template slot-scope="{ row }">
          <gb-input-number 
            v-if="row.isEdit" 
            :limit-type="billingMethod == 1 ? 'integer' : 'float'" v-model="row.additional"
            placeholder="请输入" clearable />
          <span v-else>{{ row.additional }}</span>
        </template>
      </el-table-column>
      <el-table-column label="续费(元)">
        <template slot-scope="{ row }">
          <gb-input-number 
            v-if="row.isEdit" v-model="row.additionalFee"
            placeholder="请输入" clearable />
          <span v-else>{{ row.additionalFee }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="100px">
        <template slot-scope="{ row, $index  }">
          <el-button type="text" @click="handleEditRow(row)" size="small">
            {{ row.isEdit ? '确定' : '编辑' }}
          </el-button>

          <el-button type="text" class="text_red" size="small" @click="handleDelRow($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MultiSelectAreaCity from './MultiSelectAreaCity'

export default {
  name: 'RegionalShippingTable',
  components: {MultiSelectAreaCity},

  props: {
    // 表格数据
    tableData: {
      type: Array,
      required: true
    },
    // 计费方式
    billingMethod: {
      type: Number,
      required: true
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
          regions: [],
          additional: undefined,
          additionalFee: undefined,
          first: undefined,
          firstFee: undefined,
          isEdit: true
        })
    },
    /**编辑一行*/
    handleEditRow(row) {
      if(row.isEdit) {//编辑中【确定按钮】
        let notNullValue = Object.keys(row).every((item, index) => {
          if(item == 'regions') {
            return row.regions.length;
          };
          return row[item]; //对象每一个属性不能为空
        })

        if(notNullValue) {
          row.isEdit = false;
          this.$emit('verify');//表单主动验证
        }else {
          this.$message.info('每一条数据都不能有空值！')
        }
      }else {//启用编辑【编辑按钮】
        row.isEdit = true;
      }
    },
    /**删除一行*/
    handleDelRow(index) {
      this.syncedTableData.splice(index, 1);
      this.$emit('verify');//表单主动验证
    }
  }
}
</script>

<style>

</style>