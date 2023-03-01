<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <v-tags></v-tags>
    <div class="right-menu">
      <div class="userinfo">
        <span class="userinfo__name">{{ userInfo.adminName }}</span>
        <img :src="avatar + '?imageView2/1/w/80/h/80'" class="userinfo__avatar" />
        <el-dropdown 
          v-if="!hideMultiLangOperate"
          trigger="click" @command="setNewLocale"
        >
          <span class="el-dropdown-link">
            <svg-icon icon-class="language" /><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in langList" :key="item.locale"
              :command="item.locale" :disabled="locale == item.locale">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <svg-icon 
          icon-class="logout" 
          style="font-size: 20px;margin-left: 10px;cursor: pointer;" 
          @click.native="logout" />
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  const { cachePrefix, hideMultiLangOperate } = require('@/settings')
  import { getLangList, setLocale, getLocale }  from '@/utils/lang-data-hanlde'

  import Hamburger from '@/components/Hamburger'
  import vTags from './Tags'

  export default {
    components: {
      Hamburger,
      vTags
    },

    computed: {
      ...mapGetters(['sidebar']),
      avatar() {
        return this.userInfo.head ?
          this.userInfo.head :
          './images/headPortrait/default.png'
      }
    },
    data() {
      return {
        userInfo: JSON.parse(sessionStorage.getItem(cachePrefix + "user_info")),
        // 多语言
        langList: getLangList(),
        locale: getLocale(),
        hideMultiLangOperate
      }
    },

    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      /**设置新语言*/
      setNewLocale(newLocale) {
        this.locale = newLocale;
        setLocale(newLocale);
        location.reload()
      },
      /**退出登录*/
      async logout() {
        this.$confirm('您确定要退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
      }
    }
  }

</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

<style lang="scss" scoped>
  .navbar {
    height: 80px;
    overflow: hidden;
    position: relative;
    background: #5C8DFF;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 50px;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .right-menu {
      height: 50px;
      position: absolute;
      right: 0;top: 0;
      padding-right: 15px;;

      .userinfo {
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: white;

        &__avatar {
          height: 30px;width: 30px;
          margin: 0 10px;
          border-radius: 50%;
        }
      }
    }
  }

</style>
