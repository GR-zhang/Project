<template>
  <el-drawer
    :title="title"
    :visible.sync="syncedVisible"
    :before-close="handleClose"
    size="60%" :wrapper-closable="false" direction="ltr" 
  >
    <div class="backtop content-scroll">
      <el-form
        ref="formRef" style="padding: 0 40px;"
        :model="rowData"
        label-position="left" label-width="95px"
      > 
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单状态">
              <multi-tag-display 
                :value="rowData.orderStatus" 
                :multi-tag-info="multiTagInfo.orderTypeMap_pickup" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">{{ rowData.createTime * 1000 | parseTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单ID">{{ rowData.orderId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提货单号">{{ rowData.orderSn }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总邮费">{{ rowData.totalPrice }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式">{{ rowData.paymentTypeTag }}</el-form-item>
          </el-col>

          <gb-table-display
            class="mb_10"
            :table-loading="loading_table"
            :table-list="rowData.deliveryOrderItemsVOList"
            :table-columns="tableColumns"
            :has-operation-column="false" />

          <el-form-item label="发货时间">{{ rowData.freightTime * 1000 | parseTime }}</el-form-item>
          <el-form-item label="物流状态">
            {{ deliveryStatusMap.get(Number.parseInt(rowData.deliveryStatus)) }}
          </el-form-item>
          <el-form-item label="快递公司">{{ rowData.expressCompany }}</el-form-item>
          <el-form-item label="物流单号">{{ rowData.expressNo }}</el-form-item>
          <el-form-item label="收货人">{{ rowData.receiver }}</el-form-item>
          <el-form-item label="联系电话">{{ rowData.phone }}</el-form-item>
          <el-form-item label="收货地址">{{ rowData.region + rowData.detail }}</el-form-item>
          <el-form-item label="收货时间">{{ rowData.receiptTime * 1000 | parseTime }}</el-form-item>

          <!-- 物流状态【未发货】显示 -->
          <template v-if="rowData.orderStatus == 7">
            <el-divider content-position="left">发货信息</el-divider>
            <!-- todo: 临时发货公司数据 -->
            <el-form-item label="发货公司" prop="deliveryCompany" 
              :rules="[{required: true, message: '发货公司不能为空', trigger: 'change'}]"
            >
              <select-express-company v-model="rowData.deliveryCompany" />
            </el-form-item>
            <el-form-item label="快递单号" prop="trackingBill"
              :rules="[{required: true, message: '快递不能为空', trigger: 'blur'}]"
            >
              <el-input v-model="rowData.trackingBill" placeholder="请输入快递单号" clearable />
            </el-form-item>
          </template>
        </el-row>
        
      </el-form>
      <!-- 返回顶部 -->
      <el-backtop ref="backtopRef" target=".backtop" />
    </div>
    <div class="drawer-operation-btn">
      <!-- 物流状态【未发货】显示 -->
      <template v-if="rowData.orderStatus == 7">
        <el-button size="medium" @click="handleClose">取消</el-button>
        <el-button type="primary" size="medium" :loading="loading_submit" @click="_handleSubmit">确定发货</el-button>
      </template>
      <el-button v-else @click="handleClose" size="medium">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { deliveryStatusMap, multiTagInfo } from '@/config'

import MultiTagDisplay from '@/components/global/GbTableDisplay/MultiTagDisplay.vue'
import { SelectExpressCompany } from '@/components/business'

export default {
  name: 'PickupOrderDetailDrawer',
  components: { MultiTagDisplay, SelectExpressCompany },

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
      multiTagInfo,
      deliveryStatusMap,
      loading_submit: false,
      // 表格
      loading_table: false,
      tableColumns: [
        {label: '藏品名称', prop: 'colName', minWidth: 130},
        {label: '藏品版号', prop: 'itemSn', minWidth: 130},
        {
          type: 'img',
          label: '藏品主图',
          prop: 'thumb',
          minWidth: 100
        },
        {label: '运费', prop: 'expressPrice', minWidth: 100}
      ]
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
      if(val && this.$refs['backtopRef'] ) {
        this.$refs['backtopRef'].scrollToTop();
      }
    }
  },

  methods: {
    /**提交*/
    _handleSubmit() {
      this.$refs['formRef'].validate(async (valid) => {
        if(valid) {
          this.loading_submit = true;
          try{
            await this.$api.confirm_one_delivery({
              orderId: this.rowData.orderId,
              contactInfo: this.rowData.phone,
              deliveryCompany: this.rowData.deliveryCompany,
              trackingBill: this.rowData.trackingBill
            })
            this.syncedVisible = false;
            this.$message.success('发货成功');
            this.$emit('refresh');
          }catch(e) {
            throw e;
          }finally {
            this.loading_submit = false;
          }
        }
      })
    },
    // 关闭
    handleClose() {
      this.$refs['formRef'].clearValidate();

      this.syncedVisible = false;
    }
  },
 
}
</script>

<style lang="scss" scoped>
.content-scroll {
  overflow-y: auto;
  height: calc(100vh - 140px);
}
</style>