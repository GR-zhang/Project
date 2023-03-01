<template>
  <el-submenu :index="routeArr.meta.superRedirect" >
    <template slot="title">{{routeArr.meta.title}}</template>
    <router-link :to="{ name: child.name}" v-for="(child, indez) in routeArr.children" :key="indez">
      <template v-if="!child.children">
        <el-menu-item :index="child.meta.superRedirect" >{{child.meta.title}}</el-menu-item>
      </template>

      <!-- 订单管理又多了一层 -->
      <template v-else>
        <!-- 组件递归 -->
        <Submenu :routeArr="child" />
      </template>
    </router-link>
  </el-submenu>
</template>
<script>
export default {
  name:"Submenu",
  props:{
    routeArr:{
      default(){
        return {}
      },
      type:Object,
    }
  }
}
</script>