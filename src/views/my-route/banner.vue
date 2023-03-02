
<template>
  <div>
    <div class="table_card">
      
      <el-table
        v-loading="loading_table"
        :data="tableData" border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="colName"
          label="藏品名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="imgUrl"
          label="轮播图"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重"
          min-width="180">
        </el-table-column>
      </el-table>
    </div>

  
  </div>
</template>
<script>
  const initPageParams = {
    pageNum : 1,
    pageSize : 10

  }
  export default {
    name:'Banner',
    data(){
      return {
        pageParams: { ...initPageParams },
        tableData: [],
        total: 0,
        loading_table: false,
      }
    },
    async created(){
      this._getList();
    },
    methods:{
      async _getList(){
        this.loading_table = true;
        try{
          const res = await this.$api.get_banner_list({
            params: this.pageParams,
            data:{}
            })
          this.tableData = res.data.rows;
          this.total = +res.data.total;
          }catch(e){
            throw e;
          }finally{
            this.loading_table = false;
          }
      }
  }
}

  
</script>
<style lang="scss" scoped>

</style>