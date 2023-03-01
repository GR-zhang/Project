<template>
  <section class="app-main">
    <div class="left-nav" v-if="!$route.matched[0].meta.noChild">
      <el-scrollbar class="menu-content" style="height:100%">
        <el-menu
          :default-active="$route.path"
          background-color="#fcfbfc"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <div v-for="(route, index) in showRoute.children" :key="route.meta.superRedirect" :id="index">
            <template v-if="route.children">
              <MySubMenu :routeArr="route" />
            </template>

            <template v-else> 
              <router-link :to="{ name: route.name}">
                <el-menu-item :index="route.meta.superRedirect" >{{route.meta.title}}</el-menu-item>
              </router-link>
            </template>
          </div>

        </el-menu>
      </el-scrollbar>
    </div>
    <div class="right-bg" :class="{'right-content': !$route.matched[0].meta.noChild}">
      <transition name="fade-transform" mode="out-in">
        <!-- <keep-alive> -->
          <router-view :key="key" />
        <!-- </keep-alive> -->
      </transition>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import MySubMenu from "./MySubMenu.vue"
export default {
  name: 'AppMain',
  components: { MySubMenu },
  computed: {
    ...mapGetters(['permission_routes']),
    variables() {
      return variables
    },
    showRoute() {
      let obj = {}
      const aa = this.permission_routes.filter(item=>{
        return !item.hidden && !item.meta.noChild
      })
      // console.log('ffrfrfaa', aa);
      for (const v of aa) {
        if(v.meta.superRedirect == this.$route.path.split('/')[1]) {
          obj = v
          break
        } 
      }
      // console.log('obj', obj);
      return obj
    },
    activeMenu() {
      console.log('activeMenu', this.$route);
      const route = this.$route
      const { meta, path, name } = route
      return path
    },
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
$-sec-menu-width: 180px;

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #FCFCFC;
}
.fixed-header + .app-main {
  padding-top: 80px;
  min-height: 100vh;
}
.left-nav {
  position: fixed;
  /* min-height: 100vh; */
  height: calc(100vh - 80px);
  width: $-sec-menu-width;
  background-color: #FCFCFC;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
}
::v-deep .left-nav .el-scrollbar__wrap{
  height: 100%;
  overflow-x: hidden;
}
::v-deep .left-nav .is-horizontal {
  display: none;
}
.right-bg {
  background-color: #edf1fa;
  min-height: calc(100vh - 80px);
  padding: 15px;
}
.right-content {
  margin-left: $-sec-menu-width;
}
.el-menu {
  border: none;
}
.menu-content {
  margin: 10px !important
}

::v-deep .el-menu-item.is-active {
  background-color: #e3f3ff !important;
  border-radius: 10px;
}
::v-deep .el-submenu .el-menu-item {
  width: 100%;
  min-width: 150px;
}

</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.header {
  padding: 20px 20px 0;
  background-color: #fff;
  border-radius: 10px;

  &-title {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .search {
    width: 120px;
    margin-right: 10px;
  }
}
.el-form-item {
  margin-bottom: 15px;
}

</style>
