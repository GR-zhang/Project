<template>
  <div class="">
    <div class="table_card">
      <el-table
        v-loading="loading_table"
        :data="tableData" border
        style="width: 100%">
        <el-table-column
          prop="orderId"
          label="id"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="itenType"
          label="订单类型"
          min-width="180">
        </el-table-column>
      </el-table>
      <gb-pagination
        :page.sync="pageParams.pageNum"
        :limit.sync="pageParams.pageSize"
        :total="total"
        @pagination="_getList" />
    </div>

  </div>
</template>
    

<script>
  const initPageParams = {  
    pageNum:1,
    pageSize:10 
  }
  export default {
    name: 'Person',
    data(){
      return {
        pageParams: { ...initPageParams },
        tableData:[],
        total:0,
        loading_table:false,
      }
    },
    async created() {
      this._getList();
    },
    methods:{
      async _getList(){
        this.loading_table = true;
        try{
          const res = await this.$api.order_test({
            params: this.pageParams,
            data: {}
          })
          this.tableData = res.data.rows;
          this.total = +res.data.total;
        }catch(e){
          throw e;
        }finally{
          this.loading_table = false;
        }
      },
      filterQuery() {
      this.pageParams.pageNum = 1;
      this._getList();
      },
      resetQuery() {
        this.pageParams = { ...initPageParams };
        this._getList();
      }
    }
}
</script>

<style lang="scss" scoped>

</style>
