<template>
  <div class="left-content" :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="wrapper">
      <el-scrollbar class="menu-content" wrap-class="scrollbar-wrapper" style="height:100%">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <router-link :to="{ name: route.name}" v-for="(route,index) in showRoute" :key="index">
          <el-menu-item :index="route.meta.superRedirect" :class="{'submenu-title-noDropdown':true}">
            <item :icon="route.meta.icon" :title="route.meta.title" />
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-scrollbar>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import Item from './Item'
import AppLink from './Link'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo, Item, AppLink },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar' ]),
    showRoute() {
      const aa = this.permission_routes.filter(item=>{
        return !item.hidden
      })
      // console.log('aa', aa);
      return aa || []
    },
    activeMenu() {
      const route = this.$route
      // console.log(9999999, this.$route);
      const { matched , path} = route
      return path.split('/')[1]
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
}
</script>
<style lang="scss" scoped>
.menu-content {
  margin: 10px !important;
  padding-bottom:20px;
}
.wrapper{
  height: calc(100vh - 50px);
  ::v-deep{
    .el-scrollbar__wrap{
      height: 100%;
      overflow-x: hidden;
    }
    .is-horizontal {
      display: none;
    }
  }
}

::v-deep .el-menu-item.is-active {
  background-color: #e3f3ff !important;
  border-radius: 10px;
}
</style>