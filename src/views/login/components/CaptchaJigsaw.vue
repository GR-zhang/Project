<template>
  <div>
    <div class="captcha">
      <div class="captcha-title">
        <div class="title-left">{{ titleMsg }}</div>
        <div class="title-right">
          <i class="el-icon-refresh" @click="onClickRefresh" title="刷新"></i>
          <i class="el-icon-close" @click="onClickClose" title="关闭"></i>
        </div>
      </div>
      <div class="captcha-image" v-loading="loading">
        <img :src="'data:image/png;base64,'+bgImg" :width="bgW" :height="bgH" @mousedown="onPreventDefault($event)">
        <img class="image-slice"
             :src="'data:image/png;base64,'+sliceImg"
             :style="{top:sliceY+'px', left:sliceX+'px'}"
             @mousedown="onMouseDown($event)"
             @touchstart="onTouchStart($event)"></div>
      <div class="captcha-drag">
        <div class="drag-bg" :style="{width:msgBgW+'px', backgroundColor:msgBgColor}"></div>
        <div class="drag-text" :style="{color:msgColor}" @mousedown="onPreventDefault($event)">{{ msg }}</div>
        <div class="drag-div"
             :class="dragIcon"
             :style="{width:dragW+'px', left:dragLeft+'px'}"
             @mousedown="onMouseDown($event)"
             @touchstart="onTouchStart($event)"></div>
      </div>
    </div>
    <div class="captcha-modal" @click="onClickModal"></div>
  </div>
</template>

<script>
export default {
  name: 'CaptchaJigsaw',
  props: {
    show: {type: Boolean, default: false},
    register: {type: Function},
    login: {type: Function}
  },

  data () {
    return {
      token: '',
      loading: false,
      titleMsg: '',
      maxW: 220, // bgW - dragW
      bgW: 260,
      bgH: 160,
      bgImg: 'iVBORw0KGgoAAAANSUhEUgAAAQQAAACgCAIAAABlkIURAAAFQ0lEQVR42u3dsXLbMAyA4b7/e2XNmLFj1o4ZXV1wh+JAiZZdt5bt7x9yiRPRiYPfBEiR/PEF4JsfXgKADAAZADIAZADIAJABIANABoAMABkAMgBkAMgAkAEgA0AGgAwAGQAyAGQAyACQASADQAaADAAZADIAZADIAJABIANABoAMABkAMgBkAEAGgAwAGQAyAGQAyACQASADQAaADAAZADIAZDgcP7fx4pDhtfj4+HhfY3nci0MGMpCBDC/Dr8JEhl//C/8RMtyHz8/P94OhPiHDsfKiOyIlIwMZyECGY8iw5EtLvk4GMpDhfTHhdDodoaMgAxnuKcPSLYxZ03wEaSlzyUCGJ5Th9E2TYQn30zZ7cqqltZi9XmRbPu7sdshAhgeTYT4mu1y7NWNwdjCXDGR4kp4hkqsI+tYVREcRzzvJsshAhsPJsHz+uc1qNEccT2ayc+Rq0reQgQyHk+G6wrf1GB+FlkctzzgxCmR4YBlilKl1LEub2XgbgwofxmckAxkeW4YW2VEb1BpjtXpu/pCBDM8gwxLTGegRzdlmraTHknp8UjKQ4YFlaDEd9XGMOJ1tcBxZIgMZHliGSIri2uwW9pgQ5rTciQxkeHgZJmNK82vJQIanlWH/nRc5V00GMjyhDBfx9vY23jpOBjI8TwF99TAUGcjw8DKsDgrtt8hoEhmeSoaYbL7JVWQgwyFk+Msbky7qHLYuIQMZHluGyb1Gk8xqdQSWDGR47DSpzj3vaSTWPLiFmwxPK0Ndq7DVVK7vsZUlGY4ow9f3DRRfN9pGKaM5hk1zH+/cdmC+8pMMZLinDLFW87ZbxdToTzf2TE6TgQz3lOGidN++SWR4chnGlZlkIMOLymCvVTK8OjHscyhapQEyAGQAyACQASADQAaADAAZ/i9XnLgc+xfVFsabi9rPTw5hmFwytnD2+Oe4z8+/lQzXsHPF2XhJBmUsu5mEYNx5ulOGiOaY7c47WKOFnPWbXD7+tiDDBTLkiWwRbbEjS5J3bt9QhsnZ5hMZcu/h1i9V6i7Fe3oSkGE9r8gQzHNGMvSvk2F1rWY8mIe41Wvb+Sbtyzzxrcqwc48Z/2gy7JUhe4AaoxGOWzLsCb66LCE/afLUz/fvElBlqOcG1V1Zcw0dGchwQZoUH/Put3rK7ZYMqc1IC75sIbOdLRlqWtVyoYzp1ni7vKnSOjGQYW+aVNdYtnfrSZp0lqx6o/0WwS1N2lotXXfhbuUHGchwy56hLtypRxLmt0YZWp09KVUzXtOrLRny9Kq6GDq3D1sdTWpHsrcCWppEhot7hiTr1BhcWq0Zzu579zcyZIaWOVvKUJM3BTQZ/m2aVAdYJ2nS6lm32V2sDii18mNSM8y3Zx0nGRTQZLi9DDU1qsOXTYYIuHEgdax6x6w9k5x5AV3zt8y+sv2Wj7UvW80w/nC0MHmkza+T4UV7hgyOHAwdZVjNVSYy1Cy/ns+wNc+wukNMHeCKrmbrz5nPQI/dS/1LawX/ap0JGf68AY/DoxHEGZo1VlZviFiVIR/MdlY3024yRL9Ua4acA8lf6ToZxm6tuZ0TgnoGMvxctSLDKwrc1XfNLRnqBtpjFzFPk2rX1EqC62T4GqYpxkdes8Agw0pWfcUP/KMwqs/bsvyb/LYgA0AGgAwAGQAyAGQAyACQASADQAaADAAZADIAZADIAJABIANABoAMABkAMgBkAMgAkAEgA0AGgAwAGQAyAGQAyACQASADQAaADAAZvAQAGQAyAGQAyACQASADQAaADAAZADIAZADIAJABIANABoAMwH34DTVVB+Uksi5yAAAAAElFTkSuQmCC',
      sliceW: 64,
      sliceY: 0,
      sliceImg: '',
      dragW: 40,
      dragLeft: 0,
      dragIcon: 'drag-icon',
      msg: '拖动滑块完成上方拼图',
      msgColor: '#2c3e50',
      msgBgColor: '#67c23a',
      isMoving: false, // 滑块是否正在移动
      canMove: true, // 滑块是否可以移动
      beginClientX: 0, // 距离屏幕左端距离
    }
  },

  computed: {
    msgBgW () {
      // dragLeft + dragW / 2
      return this.dragLeft + 20
    },
    sliceX () {
      // dragLeft / (bgW - dragW) * (bgW - sliceW)
      return this.dragLeft / 220 * 196
    }
  },

  mounted: function () {
    this.registerCaptcha()
  },

  methods: {

    /**
     * 初始化
     */
    registerCaptcha () {
      this.loading = true
      this.register().then(res => {
        this.loading = false
        this.sliceImg = res.data.sliceImg
        this.bgImg = res.data.bgImg
        this.token = res.data.token
        this.sliceY = res.data.y
      }, err => {
        throw err;
      })
    },

    /**
     * 恢复默认状态
     */
    restoreCaptcha () {
      this.dragLeft = 0
      this.isMoving = false
      this.canMove = true
      this.beginClientX = 0
      this.defaultStyle()
    },

    /**
     * 刷新
     */
    refreshCaptcha () {
      this.restoreCaptcha()
      this.registerCaptcha()
    },

    /**
     * 点击刷新
     */
    onClickRefresh () {
      this.refreshCaptcha()
    },

    /**
     * 点击遮罩关闭
     */
    onClickModal () {
      if (this.canMove) {
        this.$emit('close')
      }
    },

    /**
     * 点击关闭按钮
     */
    onClickClose () {
      this.$emit('close')
    },

    /**
     * 阻止鼠标相关事件
     */
    onPreventDefault (e) {
      e.preventDefault && e.preventDefault() // 阻止文字选中等 浏览器默认事件
    },

    /**
     * 鼠标点击事件
     */
    onMouseDown (e) {
      if (this.canMove) {
        this.addEventListener('mouse') // 添加事件监听
        e.preventDefault && e.preventDefault() // 阻止文字选中等 浏览器默认事件
        this.isMoving = true // 开始滑动
        this.beginClientX = e.clientX // 初始x坐标
      }
    },

    /**
     * 触摸点击事件
     */
    onTouchStart (e) {
      if (this.canMove) {
        this.addEventListener('touch') // 添加事件监听
        e.preventDefault && e.preventDefault() // 阻止文字选中等 浏览器默认事件
        this.isMoving = true // 开始滑动
        this.beginClientX = e.changedTouches[0].clientX // 初始x坐标
      }
    },

    /**
     * 添加移动/结束事件监听
     */
    addEventListener (type) {
      let html = document.getElementsByTagName('html')[0]
      if (type === 'mouse') {
        html.addEventListener('mousemove', this.onMouseMove)
        html.addEventListener('mouseup', this.onMouseUp)
      } else if (type === 'touch') {
        html.addEventListener('touchmove', this.onTouchMove)
        html.addEventListener('touchend', this.onTouchEnd)
      }
    },

    /**
     * 鼠标移动事件
     */
    onMouseMove (e) {
      if (this.isMoving) {
        let width = e.clientX - this.beginClientX // 当前x坐标
        if (width > 0 && width < this.maxW) {
          this.dragLeft = width
        } else if (width >= this.maxW) { // 滑动完成
          this.dragLeft = this.maxW
        }
      }
    },

    /**
     * 触摸滑动事件
     */
    onTouchMove (e) {
      if (this.isMoving) {
        let width = e.changedTouches[0].clientX - this.beginClientX // 当前x坐标
        if (width > 0 && width < this.maxW) {
          this.dragLeft = width
        } else if (width >= this.maxW) { // 滑动完成
          this.dragLeft = this.maxW
        }
      }
    },

    /**
     * 鼠标结束事件
     */
    onMouseUp (e) {
      this.removeEventListener('mouse') // 移除事件监听
      this.canMove = false // 不能滑动
      this.isMoving = false // 结束滑动
      this.checkCaptcha()
    },

    /**
     * 触摸结束事件
     */
    onTouchEnd (e) {
      this.removeEventListener('touch') // 移除事件监听
      this.canMove = false // 不能滑动
      this.isMoving = false // 结束滑动
      this.checkCaptcha()
    },

    /**
     * 移除移动/结束事件监听
     */
    removeEventListener (type) {
      let html = document.getElementsByTagName('html')[0]
      if (type === 'mouse') {
        if (window.addEventListener) {
          html.removeEventListener('mousemove', this.onMouseMove)
          html.removeEventListener('mouseup', this.onMouseUp)
        } else {
          html.removeEventListener('mouseup', () => {
          })
        }
      } else if (type === 'touch') {
        if (window.addEventListener) {
          html.removeEventListener('touchmove', this.onTouchMove)
          html.removeEventListener('touchend', this.onTouchEnd)
        } else {
          html.removeEventListener('touchend', () => {
          })
        }
      }
    },

    /**
     * 拼图校验与登录
     */
    checkCaptcha () {
      if (!this.sliceImg || !this.sliceY) {
        this.errorStyle('请刷新验证码')
        return false
      }
      
      if(this.login) {// 传入login函数，代码调用check验证就扣
        this.login(this.token, this.sliceX).then(respData => {
          this.$emit('verified');
        }, err => {
          this.refreshCaptcha();
          throw e;
        })
      }else {
        this.$emit('verified', {
          token: this.token,
          sliceX: this.sliceX
        });
      }
    },

    /**
     * 默认样式
     */
    defaultStyle () {
      this.dragIcon = 'drag-icon'
      this.msgBgColor = '#67c23a'
      this.msgColor = '#2c3e50'
      this.msg = '拖动滑块完成上方拼图'
      this.titleMsg = ''
    },

    /**
     * 检查成功样式
     */
    successStyle () {
      this.dragIcon = 'drag-success-icon'
      this.msgBgColor = '#67c23a'
      this.msgColor = '#fff'
      this.msg = ''
      this.titleMsg = '验证成功'
    },

    /**
     * 检查失败样式
     */
    errorStyle (errorMsg) {
      this.dragIcon = 'drag-error-icon'
      this.msgBgColor = '#f56c6c'
      this.msgColor = '#fff'
      this.msg = ''
      this.titleMsg = errorMsg
    }
  }

}
</script>

<style scoped>
.captcha-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .1;
  background: #000;
}

.captcha {
  animation-duration: .8s;
  /*width: 282px;*/
  /*height: 267px;*/
  position: absolute;
  top: calc(50% - 133.5px);
  left: calc(50% - 141px);
  z-index: 65337378;
  padding: 10px 10px 12px 10px;
  border-radius: 2px;
  border: 1px solid #e4e7eb;
  box-shadow: 0 0 10px rgba(0, 0, 0, .3);
  background-color: #fff;
  overflow: hidden;
  transform: translateY(-50px);
}

.captcha .captcha-title {
  width: 100%;
  height: 25px;
}

.captcha .captcha-title .title-left {
  float: left;
  height: 25px;
  line-height: 25px;
  padding-left: 2px;
}

.captcha .captcha-title .title-right {
  float: right;
  height: 25px;
  line-height: 25px;
}

.captcha .captcha-title .title-right i {
  font-size: 25px;
  cursor: pointer;
  color: #7f7f7f;
}

.captcha .captcha-title .title-right i:hover {
  color: #000000;
  font-weight: 500;
}

.captcha .captcha-image {
  width: 260px;
  height: 160px;
  position: relative;
  margin: 8px 0 0 0;
}

.captcha .captcha-image .image-slice {
  position: absolute;
  display: block;
  cursor: pointer;
}

.captcha .captcha-drag {
  margin: 10px 0 0 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
  background-color: #e8e8e8;
  text-align: center;
  border-radius: 2px;
}

.captcha .captcha-drag .drag-bg {
  height: 40px;
  border-radius: 2px;
}

.captcha .captcha-drag .drag-text {
  position: absolute;
  top: 0;
  width: 100%;
  text-align: center;
  user-select: none;
}

.captcha .captcha-drag .drag-div {
  height: 40px;
  border: 1px solid #ccc;
  position: absolute;
  top: 0;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .3);
  cursor: pointer;
}

.captcha .captcha-drag .drag-icon {
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==") no-repeat center;
}

.captcha .captcha-drag .drag-success-icon {
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==") no-repeat center;
}

.captcha .captcha-drag .drag-error-icon {
  background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABNUlEQVQ4T6VTwU3DQBCcxf6gy4MSoAKgAtIBoQLgF8mWEjpxJJ+UZ+jA6SB0YFcAJeSBxcdm0J18jn22okTcb29v53ZmdwTe+ZnPr+sgWAgwhcidTZM5gV1Q16vL9fqrWyLd4DuOEwEWPmg3JplMtH5zdy1AGcc5gNtjxW2OzJXW9ya2AKf87AMTWE3SdCmG828YfroHBD6E3EPksVdEbilyJcCDu7+oqhsZ+T1TafpURtEGIs+NiO9K65cyirIusOlCRrmTG6X1qwUB0BQfANt2mRsAjgrXgJhcrxvv8TEA2/YpAMPxkY6zocCWjtPk0EUxFJHcKq1nnohOk6GII2PcCbAHMPPoZgTMGKe9Mf57kRzaWasMFCpNrdHON1OzwgMzuQtr5zBcNlyduQpr56pKfDv/AUZmrmbsIMGcAAAAAElFTkSuQmCC") no-repeat center;
}
</style>
