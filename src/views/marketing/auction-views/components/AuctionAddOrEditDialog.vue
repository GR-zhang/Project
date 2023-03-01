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
      label-position="left" label-width="120px"
      :disabled="dialogType == 'detail'"
    > 
      <el-form-item label="竞拍类型" prop="activityMode">
        <el-select
          v-model="rowData.activityMode"
          placeholder="请选择竞拍类型"
          clearable filterable
        >
          <el-option
            v-for="(item, index) in options_auctionType" :key="index"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="竞拍商品" prop="goodsId">
        <el-button
          class="mb_10"
          size="mini" type="info" 
          @click="dialogVisible_nested = true;">选择</el-button>
        <div class="flex_row_start_center">
          <el-image
            :style="{width: '80px', height: '80px', margin: '10px 10px 0 0'}"
            :src="rowData.thumb"
            fit="contain"
            :preview-src-list="[rowData.thumb]"
          >
            <div slot="error" style="height: 100%;display: flex;justify-content: center;align-items: center;">
              <i class="el-icon-picture-outline" style="font-size: 30px;" />
            </div>
          </el-image>
          <div>
            <div>
              藏品编号:&nbsp;&nbsp;
              <el-tag type="danger" effect="plain">{{ rowData.goodsId ? rowData.goodsId : '暂未选择' }}</el-tag>
            </div>
            <div>
              藏品标题:&nbsp;&nbsp;
              <el-tag type="danger" effect="plain">{{ rowData.colName ? `${rowData.colName} #${rowData.itemSn}` : '暂未选择' }}</el-tag>
            </div>
          </div>
        </div>

        <!-- 对话框【藏品选择】 -->
        <goods-select-dialog
          :dialog-visible.sync="dialogVisible_nested"
          dialog-title="商品选择"
          :active-id="rowData.goodsId"
          @sel-one="(row) => {
            rowData.thumb = row.thumb;
            rowData.goodsId = row.goodsId;
            rowData.colId = row.colId;
            rowData.colName = row.colName
            rowData.itemSn = row.itemSn
            $refs.dialogFormRef.validateField('goodsId');
          }" />
      </el-form-item>

      <!-- 竞拍参数(共享) -->
      <el-form-item label="竞拍起步价" prop="startingPrice">
        <gb-input-number v-model="rowData.startingPrice" placeholder="请输入竞拍起步价" unit="元" />
      </el-form-item>
      <el-form-item label="保证金" prop="deposit">
        <gb-input-number v-model="rowData.deposit" placeholder="请输入保证金" unit="元" />
      </el-form-item>
      <!-- 非添加,且时用户发起显示 -->
      <el-form-item v-if="dialogType != 'add' && rowData.marketType == 2" label="成交手续费" prop="feeRatio">
        <gb-input-number v-model="rowData.feeRatio" placeholder="请输入成交手续费" unit="%" />
      </el-form-item>
      <!-- 英式竞拍 -->
      <template v-if="rowData.activityMode == 1">
        <el-form-item label="加价幅度" prop="markupRange">
          <gb-input-number v-model="rowData.markupRange" placeholder="请输入加价幅度" unit="%" />
        </el-form-item>
        <el-form-item label="延时周期" prop="delayCycle">
          <gb-input-number limit-type="integer" 
            v-model="rowData.delayCycle" placeholder="请输入延时周期" unit="分" />
        </el-form-item>
      </template>
      <!-- 荷兰式竞拍 -->
      <template v-if="rowData.activityMode == 2">
        <el-form-item label="竞拍底价" prop="lowestPrice">
          <gb-input-number v-model="rowData.lowestPrice" placeholder="请输入竞拍底价" unit="元" />
        </el-form-item>
        <el-form-item label="减价幅度" prop="priceReduction">
          <gb-input-number v-model="rowData.priceReduction" placeholder="请输入减价幅度" unit="元" />
        </el-form-item>
        <el-form-item label="系统减价周期" prop="reductionCycle">
          <gb-input-number limit-type="integer"
            v-model="rowData.reductionCycle" placeholder="请输入系统减价周期" unit="分" />
        </el-form-item>
      </template>

      <el-form-item label="保证金缴纳时间" prop="datetimeRange_deposit">
        <gb-picker-datetime-range v-model="rowData.datetimeRange_deposit" :collect-params-obj="rowData"
          :assign-fields="['depositStartTime', 'depositEndTime']" />
      </el-form-item>
      <el-form-item label="竞拍时间" prop="datetimeRange_auction">
        <gb-picker-datetime-range v-model="rowData.datetimeRange_auction" :collect-params-obj="rowData"
          :assign-fields="['startTime', 'endTime']" />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button v-if="dialogType == 'detail'" @click="handleCloseDialog" size="medium">关闭</el-button>
      <template v-else>
        <el-button @click="handleCloseDialog" size="medium">取消</el-button>
        <el-button
          :loading="syncedSubmitLoading"
          type="primary" @click="handleSubmit" size="medium">确定</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import { auctionTypeMap, generateOptionsByMap } from '@/config'

import { GoodsSelectDialog } from '@/components/business'
import { GbPickerDatetimeRange } from '@/components/global'

export default {
  name: 'AuctionAddOrEditDialog',
  components: { GoodsSelectDialog, GbPickerDatetimeRange },

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
    // 对话框表单参数对象
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
      options_auctionType: generateOptionsByMap(auctionTypeMap),
      rules: {
        activityMode: [{required: true, message: '竞拍类型不能为空', trigger: 'blur'}],
        goodsId: [{required: true, message: '竞拍商品不能为空', trigger: 'blur'}],
        startingPrice: [{required: true, message: '竞拍起步价不能为空', trigger: 'blur'}],
        deposit: [{required: true, message: '保证金不能为空', trigger: 'blur'}],

        // 英式竞拍
        feeRatio: [{required: true, message: '成交手续费不能为空', trigger: 'blur'}],
        markupRange: [{required: true, message: '加价幅度不能为空', trigger: 'blur'}],
        delayCycle: [{required: true, message: '延时周期不能为空', trigger: 'blur'}],
        // 荷兰式竞拍
        lowestPrice: [{required: true, message: '竞拍底价不能为空', trigger: 'blur'}],
        priceReduction: [{required: true, message: '减价幅度不能为空', trigger: 'blur'}],
        reductionCycle: [{required: true, message: '系统减价周期不能为空', trigger: 'blur'}],

        datetimeRange_deposit: [{required: true, message: '保证金缴纳时间不能为空', trigger: 'blur'}],
        datetimeRange_auction: [{required: true, message: '竞拍时间不能为空', trigger: 'blur'}]
      },
      // 内嵌对话框
      dialogVisible_nested: false,
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
    // 双向数据绑定submitLoading
    syncedSubmitLoading: {
      get() {
        return this.submitLoading;
      },
      set(newVal) {
        this.$emit('update:submitLoading', newVal);
      }
    },
    finnalTitle() {
      if(this.dialogType == 'detail') {
        return '详情'
      }

      return (this.dialogType == 'add' ? '添加' : '编辑') + this.dialogTopic
    }
  },

  methods: {
    // 提交
    handleSubmit() {
      // 确保保证金缴纳结束时间 小于 竞拍开始时间
      if(this.rowData.depositEndTime > this.rowData.startTime) {
        return this.$message.warning('保证金缴纳结束时间不能大于竞拍开始时间!');
      }
      // 荷兰式拍卖
      if(this.rowData.activityMode == 2) {
        // 确保竞拍底价 小于 竞拍起步价 
        if(this.rowData.lowestPrice > this.rowData.startingPrice) {
          return this.$message.warning('竞拍底价不能大于竞拍起步价!');
        }
        // 确保保证金 小于 竞拍底价 
        if(this.rowData.deposit > this.rowData.lowestPrice) {
          return this.$message.warning('保证金不能大于竞拍底价!');
        }
      }

      this.$refs.dialogFormRef.validate(valid => {
        if(valid) {
          this.syncedSubmitLoading = true;
          this.$emit('submit');
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