<template>
  <div class="system-init-container">
    <div class="table_card">
      <div class="header-title" style="padding-top: 10px;">系统初始化</div>
      <p>执行该操作会清除您系统内已经设定好的数据，还原系统最初始的状态，请多加考虑后再确认使用该功能</p>
      <el-button type="danger" @click="_initData">系统初始化</el-button>
    </div>
  </div>

</template>
<script>
export default {
  name: 'SystemInit',

  methods: {
    _initData() {
      this.$confirm("确认初始化吗,初始化将删除所有数据， 是否继续?", "提示", {type: "warning"}).then(() => {
        this.$api.system_init()
          .then(res => {
            this.$message.success('系统初始化成功！');
          });
      }).catch(() => {

      });
    },
  }
}
</script>

<style  lang="scss" scoped>

</style>
