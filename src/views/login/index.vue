<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
      <div class="title-container">
        <div class="title">{{ systemTitle }}系统</div>
      </div>

      <el-form-item class="username" prop="username" label="账号：">
        <el-input v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" />
      </el-form-item>

      <el-form-item class="username" prop="password" label="密码：">
        <el-input ref="password" v-model="loginForm.password" placeholder="请输入密码" name="password" show-password
          @keyup.enter.native="openSliderVerifyDialog" />
      </el-form-item>

      <!-- <el-form-item class="username" prop="phone" label="手机：">
        <el-input ref="phone" v-model="loginForm.phone" placeholder="手机号" name="phone" />
      </el-form-item>

      <el-form-item class="username" prop="messageCode" label="短信验证码：">
        <div class="authcode">
          <el-input v-model="loginForm.messageCode" placeholder="短信验证码" name="authcode" type="text" @keyup.enter.native="handleLogin" />
          <el-button type="primary" size="small" icon="el-icon-s-promotion">发送验证码</el-button>
        </div>
      </el-form-item> -->

      <!-- <el-form-item class="username" prop="authcode" label="验证码：">
        <div class="authcode">
          <el-input v-model="loginForm.authcode" placeholder="验证码" name="authcode" type="text" @keyup.enter.native="handleLogin" />
          <img ref="authcode" class="authcode-img" :src="authcodePath" title="点击更换验证码" height="36" width="100%" @click="getVerify">
        </div>
      </el-form-item> -->
      <div style="margin: 20px 0">
        <el-checkbox v-model="rememberPwd" class="rememberPwd-check">记住密码</el-checkbox>
      </div>
      <el-button :loading="loading" type="primary" 
        style="width: 100%; margin-top: 10px; border-radius: 10px; height: 60px; font-size: 24px" 
        @click.native.prevent="openSliderVerifyDialog">登录</el-button>
    </el-form>
    <!-- 滑块验证 -->
    <captcha-jigsaw
      ref="captchaRef"
      v-if="show"
      :show="show"
      :register="registerCaptcha"
      @verified="form => handleLogin(form)"
      @close="show = false" />
    <!-- <div style="position: fixed; bottom: 40px; left: 650px">
      <span>技术支持：广州汉全信息科技股份有限公司</span>
    </div> -->
  </div>
</template>

<script>
const Base64 = require("js-base64").Base64;
const { cachePrefix, title } = require('@/settings')

import CaptchaJigsaw from './components/CaptchaJigsaw'

export default {
  name: "Login",
  components: { CaptchaJigsaw },

  data() {
    // 表单校验
    // let validPassword = (rule, value, callback) => {
    //   let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;

    //   if (!reg.test(value)) {
    //     callback(new Error("密码必须是由6-12位字母+数字组合"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validateAuthcode = (rule, value, callback) => {
    //   if (value.length != 4) {
    //     callback(new Error("请输入4位验证码"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      // 滑块验证
      show: false,

      systemTitle: title,
      // authcodePath: "",
      loginForm: {
        username: "",
        password: "",
        authcode: "",
      },
      rememberPwd: false,
      loginRules: {
        username: [{ required: true, message: '账号不能为空', trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          // { validator: validPassword, trigger: "blur" },
        ],
        // authcode: [
        //   { required: true, message: "验证码不能为空", trigger: "blur" },
        //   { validator: validateAuthcode, trigger: "blur" },
        // ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    const account = this.getCookie(cachePrefix + "account");
    const password = Base64.decode(this.getCookie(cachePrefix + "password"));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.loginForm.username = account;
      this.loginForm.password = password;
      this.rememberPwd = true;
    }
  },
  mounted() {
    // this.getVerify();
  },

  methods: {
    /**打开滑块验证对话框*/
    openSliderVerifyDialog() {
      this.$refs.loginForm.validate((valid) => {
        valid && (this.show = true);
      });
    },
    /**
     * 注册验证码
     */
    registerCaptcha () {
      return new Promise((resolve, reject) => {
        this.$api.get_sliderValidation_data().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 拼图校验与登录
     */
    // loginCaptcha (token, sliceX) {
    //   return new Promise((resolve, reject) => {
    //     let form = {
    //       token: token,
    //       sliceX: sliceX
    //     }
    //     this.$api.check_sliderValidation(form).then(resp => {
    //       resolve(resp.data)
    //     }, err => {
    //       reject(err)
    //     })
    //   })
    // },


    // getVerify() {
    //   this.authcodePath =
    //     window.__ENV__.VUE_APP_BASE_API +
    //     "/api/admin/login/createCode?adminName=" +
    //     this.loginForm.username +
    //     "&solt=" +
    //     Math.random();
    // },
    handleLogin(form) {
      this.loading = true;
      this.$store.dispatch("user/login", { ...this.loginForm, form })
        .then(() => {
          this.show = false;

          // 储存登录信息
          this.setUserInfo();

          this.$message.success('登录成功！');
          setTimeout(() => {
            this.$router.push({ path: this.redirect || "/" });
            this.loading = false;
          }, 700)
        })
        .catch((e) => {
          this.$refs['captchaRef'].refreshCaptcha();

          // this.getVerify();
          this.loading = false;
          // e.msg === '此账号无权限访问本系统' && this.$message.error('此账号无权限访问本系统');
          throw e;
        });
    },
    setUserInfo() {
      if (this.rememberPwd) {
        this.setCookie(cachePrefix + "account", this.loginForm.username);
        // base64加密密码
        const passWord = Base64.encode(this.loginForm.password);
        this.setCookie(cachePrefix + "password", passWord);
      } else {
        this.setCookie(cachePrefix + "account", "");
        this.setCookie(cachePrefix + "password", "");
      }
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #76838f;
      height: 40px;
      caret-color: #76838f;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #76838f !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(204, 204, 204, 1);
    background: $cursor;
    border-radius: 5px;
    color: #76838f;

    .authcode-img {
      position: absolute;
      right: 10px;
      height: 34px;
      width: 95px;
      top: 3px;
      z-index: 3;
      + .el-input {
        padding-right: 100px;
      }
    }
  }

  .rememberPwd-check {
    margin-bottom: 15px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2e3e9c;
$dark_gray: #76838f;
$font_color: #1a1a1a;

.login-container {
  min-height: 100%;
  width: 100%;
  height: 100%;
  background: url(../../assets/login-bg.png) no-repeat;
  background-size: cover;
  overflow: hidden;

  .login-form {
    padding: 48px;
    position: fixed;
    top: 21%;
    right: 10%;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 0;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
    border-radius: 2px;
    background-color: #fff;
    width: 550px;
  }
  .username {
    border: none;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 0;
    margin-top: 40px;
    .authcode {
      display: flex;
    }
  }

  .svg-container {
    padding: 0px 5px 0px 15px;
    color: $dark_gray;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 50px;

    .title {
      font-size: 38px;
      color: #1f87f1;
      font-weight: bold;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
