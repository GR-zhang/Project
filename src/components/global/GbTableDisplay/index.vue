<template>
  <div class="gb-table-display">
    <!-- 表格右上角操作插槽 -->
    <div class="top-right-operation-container">
      <div>
        <radio-tab
          v-if="tabOptions.length != 0"
          :tab-val="tabVal" 
          @tab-change="(val) => { tabVal = val; $emit('tab-change', val) }"
          :options="cpt_TabOptions" />
      </div>
      <div>
        <slot name="top-right-operation" />
      </div>
    </div>
  
    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      :data="tableList"
      :border="border" :stripe="stripe" size="mini" 
      @selection-change="(vals) => syncedSelRows = vals"
      @sort-change="params => $emit('trasfer-sort-change', params)"
    >
      <el-table-column
        v-if="syncedSelRows"

        type="selection"
        width="55"
        :selectable="selectableFunc">
      </el-table-column>

      <el-table-column
        v-for="(item, index) in tableColumns" :key="index"
        :label="item.label"
        :width="item.width || ''"
        :min-width="item.minWidth || ''"
        align="left"
        :prop="item.prop" :sortable="item.sortable"

        :sort-orders="['ascending', null]"
      >
        <template slot-scope="scope">
          <!-- 混合列 -->
          <template v-if="item.type == 'mixins' && item.children">
            <!-- <el-tooltip
              v-for="(_item, index) in item.children" :key="index"
              effect="dark" :content="`${_item.label}: ${scope.row[_item.prop]}`" placement="top"
            > -->
              <div v-for="(_item, index) in item.children" :key="index">
                <span class="mixins-label">{{ _item.label }}</span>
                <span v-if="_item.timestamp">{{ scope.row[_item.prop] * 1000 | parseTime }}</span>
                <span v-else>{{ scope.row[_item.prop] }}</span>
              </div>
            <!-- </el-tooltip> -->
          </template>
          <!-- 插槽列 -->
          <template v-else-if="item.type == 'slot-column'">
            <slot name="slot-column" :row="scope.row" />
          </template>
          <!-- 根据item.type渲染列 -->
          <template v-else>
              <!-- tag -->
              <template v-if="item.type == 'tag'">
                <el-tag :type="scope.row[item.prop] ? 'success' : 'danger'" size="mini">
                  {{ scope.row[item.prop] ?  item.tagInfo.successText : item.tagInfo.failureText }}
                </el-tag>
              </template>
              <template v-else-if="item.type == 'multi-tag'">
                <template v-if="item.multiTagInfo[scope.row[item.prop]]">
                  <el-tag :type="item.multiTagInfo[scope.row[item.prop]].tagType" size="mini">
                    {{ item.multiTagInfo[scope.row[item.prop]].tagText }}
                  </el-tag>
                </template>
                <template v-else>
                  <!-- ps: 兼容，防止遗漏某些状态而报错 -->
                  <el-tag type="danger">- -</el-tag>
                </template>
              </template>
              <template v-else-if="item.type == 'plain-tag'">
                <el-tag :type="item.tagType" effect="plain" size="mini">
                  {{ scope.row[item.prop] ? scope.row[item.prop] : '- -' }}
                </el-tag>
              </template>
              <template v-else-if="item.type == 'tag-arr'">
                <template v-if="scope.row[item.prop] && scope.row[item.prop].length != 0">
                  <span
                    v-for="(item, index) in scope.row[item.prop]" :key="index"
                    style="margin-right: 5px;"
                  >
                    <el-tag :type="item.tagType">{{ item }}</el-tag>
                    <br v-if="(index + 1) % 3 === 0" />
                  </span> 
                </template>
              </template>

              <!-- 图片 -->
              <template v-else-if="item.type == 'img'">
                <el-image
                  :style="item.imgScaleStyle ? item.imgScaleStyle : {width: '45px', height: '45px'}"
                  :src="scope.row[item.prop]"
                  fit="contain"
                  :preview-src-list="[scope.row[item.prop]]"
                >
                  <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                    <i class="el-icon-picture-outline" style="font-size: 30px;" />
                  </div>
                </el-image>
              </template>
              <template v-else-if="item.type == 'img-arr'">
                <el-image
                  :style="item.imgScaleStyle ? item.imgScaleStyle : {width: '45px', height: '45px'}"
                  :src="scope.row[item.prop][0]"
                  fit="contain"
                  :preview-src-list="scope.row[item.prop]"
                >
                  <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
                    <i class="el-icon-picture-outline" style="font-size: 30px;" />
                  </div>
                </el-image>
              </template>

              <template v-else-if="item.type == 'timestamp'">
                <!-- ps: 后台时间戳用s, parseTime时间戳用ms -->
                {{ scope.row[item.prop] * 1000 | parseTime }}
              </template>

              <!-- 多行展示 -->
              <template v-else-if="item.type == 'multi-line-arr'">
                <div v-for="(item, index) in scope.row[item.prop]" :key="index">{{ item }}</div>
              </template>

              <!-- switch开关 -->
              <template v-else-if="item.type == 'switch'">
                <el-switch
                  v-model="scope.row[item.prop]"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="item.switchVal ? item.switchVal[0] : 1"
                  :inactive-value="item.switchVal ? item.switchVal[1]: 2"
                  @change="$emit('switch-change', scope.row)" />
              </template>

              <!-- 业务 -->
              <template v-else-if="item.type == 'view-detail-btn'">
                <el-button type="text" size="medium" @click="$emit('view-detail', scope.row)">查看详情</el-button>
              </template>

              <!-- 默认常规列 -->
              <template v-else>
                <el-tooltip effect="dark" :content="String(scope.row[item.prop])" placement="top">
                  <span>{{ scope.row[item.prop] }}</span>
                </el-tooltip>
              </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="hasOperationColumn"
        label="操作" align="center"
        fixed="right" :width="operationColumnWidth"
      >
        <template slot-scope="scope">
          <!-- 默认插槽 -->
          <slot :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import RadioTab from './RadioTab.vue'

/** GbFormQuery组件说明
 * 1、传入tableList数据, 使用tableColumns来定制表格显示
 * 2、RadioTab查询条件
 * 3、操作列与左上角操作 插槽，可定制任意操作
*/
export default {
  name: 'GbTableDisplay',
  components: {
    RadioTab
  },

  props: {
    // v-for循环表格列
    tableColumns: {
      type: Array,
      required: true,
    },
    // 表格加载
    tableLoading: {
      type: Boolean,
      required: true
    },
    // 表格数据
    tableList: {
      type: Array,
      required: true
    },
    
    // ===== 特殊情况下 =====
    // 是否有操作列
    hasOperationColumn: {
      type: Boolean,
      default: true
    },
      // 调整操作列宽度
      operationColumnWidth: {
        type: Number,
        default: 120
      },

    // radio-tab options: 不为空时显示radio-tab,并且$emit('tab-change', val)
    tabOptions: {
      type: Array,
      default: () => []
    },
    tabVal: {//radio-tab选中值占位
      default: undefined,
    },

    // 选择列数据[传入才显示]
    selRows: {
      type: Array
    },
    selectableFunc: {
      type: Function,
      default: (row, index) => {
        return true;// 默认全部可选
      }
    },
    // ==== 表格样式 ====
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    // 加全部选项
    cpt_TabOptions() {
      let options = JSON.parse(JSON.stringify(this.tabOptions));
      options.unshift({label: '全部', value: undefined});
      return options
    },
    syncedSelRows: {
      get() {
        return this.selRows;
      },
      set(newVals) {
        this.$emit('update:selRows', newVals)
      } 
    }
  },

  methods: {
    transfer_clearSort() {
      this.$refs['tableRef'].clearSort();
    }
  }
}
</script>

<style lang="scss" scoped>
.gb-table-display{
  .top-right-operation-container {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mixins-label {
    padding: 2px;
    margin-right: 4px;
    font-size: 10px;
    color: #fff;
    border-radius: 2px;
    background-color: #303133;
  }
}

</style>