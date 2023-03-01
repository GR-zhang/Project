<template>
  <transition :name="transitionName">
    <div
      v-show="visible"
      class="back-to-ceiling"
      :style="{'background-color': backgroundColor}"
      @click="backToTop" />
  </transition>
</template>

<script lang="ts">
export default {
  name: 'GbBackTop',

  props: {
    visibilityHeight: {
      type: Number,
      default: 400
    },
    transitionName: {
      type: String,
      default: 'fade'
    },
    backPosition: {
      type: Number,
      default: 0
    },
    backgroundColor: {
      type: String,
      default: '#409eff'
    },
  },
  data() {
    return {
      visible: false,
      isMoving: false,
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      this.visible = window.pageYOffset > this.visibilityHeight
    },
    backToTop() {
      if (this.isMoving) return
      const start = window.pageYOffset
      let i = 0
      this.isMoving = true
      const interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition)
          clearInterval(interval)
          this.isMoving = false
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    }
  }
}
</script>

<style lang="scss" scoped>
.back-to-ceiling {
  position: fixed;
  right: 40px;//返回按钮背景色定位
  bottom: 40px;
  z-index: 999;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  :hover {
    background: #d5dbe7;
  }

  //三角形
  &::before {
    content: '';
    display: block;
    border: 6px solid #fff;
    border-color:  transparent transparent #fff transparent;
    transform: translateY(-3px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
