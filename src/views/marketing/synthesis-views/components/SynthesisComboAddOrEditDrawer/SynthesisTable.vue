<template>
  <div class="synthesis-table">
    <el-button
      v-if="drawerType != 'detail'"
      icon="el-icon-circle-plus-outline"
      type="primary" size="mini" style="margin-bottom: 10px;"
      @click="addRow">添加</el-button>
    <el-table :data="syncedTableList" border>
      <el-table-column label="材料名称" width="170">
        <template v-slot="{ row }">
          <el-input
            :disabled="drawerType == 'detail'"
            v-model="row.materialsName" placeholder="请输入" clearable />
        </template>
      </el-table-column>
      <el-table-column label="材料所需数量" width="130">
        <template v-slot="{ row }">
          <gb-input-number 
            :disabled="drawerType == 'detail'"
            limit-type="integer" v-model="row.materialsNumber" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="图片" width="140">
        <template v-slot="{ row }">
          <uploader-single-file
            :disabled="drawerType == 'detail'"
            :file-url.sync="row.materialsImageUrl" 
            :uploadAreaSize="{width: '98px', height: '98px'}" iconSize="small" ratio="130*130px" />
        </template>
      </el-table-column>
      <el-table-column label="元素作品合集" min-width="350">
        <template v-slot="{ row, $index }">
          <div style="text-align: right;">
            <el-button
              v-if="drawerType != 'detail'"
              icon="el-icon-circle-plus-outline"
              type="text" 
              @click="operateRowIndex = $index;drawerVisible_nested = true">添加</el-button>
          </div>
          <!-- 抽屉【藏品选择】 -->
          <collection-multi-select-drawer
            :visible.sync="drawerVisible_nested"
            title="藏品选择"
            :active-rows="row.productList"
            :active-ids="cpt_activeIds[$index]"
            @sel-row="handleSelRow" />

          <el-table :data="row.productList" border>
            <el-table-column label="藏品名称" prop="colName" min-width="120" />
            <el-table-column label="藏品主图" prop="colName" min-width="90">
              <template v-slot="{ row }">
                <el-image
                  :style="{width: '45px', height: '45px'}"
                  :src="row.picture"
                  fit="contain"
                  :preview-src-list="[row.picture]"
                >
                  <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                    <i class="el-icon-picture-outline" style="font-size: 30px;" />
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column 
              v-if="drawerType != 'detail'"
              label="操作" width="80" align="center"
            >
              <template v-slot="{ $index }">
                <el-button type="text" class="text_red" @click="row.productList.splice($index, 1);">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>    

      <el-table-column
        v-if="drawerType != 'detail'"
        label="操作" width="80" align="center"
      >
        <template v-slot="{ $index }">
          <el-button type="danger" size="mini" @click="
            syncedTableList.splice($index, 1);
            $emit('verify');
          ">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
</template>

<script>
import { tableRowContainNull } from './utils'

import { UploaderSingleFile } from '@/components/global/GbAddAndEditDialog/components'
import { CollectionMultiSelectDrawer } from '@/components/business'

export default {
  name: 'SynthesisTable',
  components: { UploaderSingleFile, CollectionMultiSelectDrawer },

  props: {
    // 表格数据
    tableList: {
      type: Array,
      required: true
    },
    // 合成藏品id
    targetColId: {
      required: true
    },
    // 抽屉类型
    drawerType: {
      type: String,
      required: true
    },
  },
  computed: {
    syncedTableList: {
      get() {
        return this.tableList;
      },
      set(vals) {
        this.$emit('update:tableList', vals);
      }
    },
    // 已选中id数组
    cpt_activeIds() {
      return this.syncedTableList.map(item => item.productList.map(_item => _item.colId));        
    },
  },
  data() {
    return {
      operateRowIndex: undefined,

      // 嵌套藏品多选drawer
      drawerVisible_nested: false,
    }
  },

  methods: {
    addRow() {
      if(tableRowContainNull(this.syncedTableList)) {
        this.$message.info('请完善表格前面的行数据再添加，注意每一行数据都不能有空值！');
        return;
      }

      this.syncedTableList.push({
        materialsImageUrl: '',
        materialsName: '',
        materialsNumber: undefined,
        productList: []
      })
    },

    /**选中一行*/
    handleSelRow(row) {
      // ps: 特殊情况: 合成藏品不允许再被选为 合成所需 素材
      if(this.targetColId == row.colId) {
        this.$message.info('合成目标藏品不能被选中！');
        return;
      }


      let index = this.syncedTableList[this.operateRowIndex].productList.findIndex(item => item.colId == row.colId);
      if(index !== -1) {//选中旧行,splice
        this.syncedTableList[this.operateRowIndex].productList.splice(index, 1);
      }else {//选中新行,push
        this.syncedTableList[this.operateRowIndex].productList.push({
          colId: row.colId,
          colName: row.colName,
          picture: row.thumb
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>