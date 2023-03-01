import Vue from 'vue'

/**
 * 节流函数
 * @param {function} func 运行函数
 * @param {Number} delay 节流时间 
 * @returns 
 */
Vue.prototype.$throttle = function throttle(func, delay = 800) {
  let startTime = 0;
  return function () {
    let endTime = new Date().getTime()
    let args = arguments;
    if (endTime - startTime >= delay) {
      func.apply(this, args)
      startTime = endTime
    }
  }
}

/**
 * 防抖函数
 * @param {Function} func 运行函数
 * @param {Number} delay 防抖时间
 * @returns 
 */
Vue.prototype.$debounce = function debounce(func, delay = 800) {
  let time = null;
  return function () {
    clearTimeout(time)
    let args = arguments;
    time = setTimeout(() => {
      func.apply(this, args)
    }, delay);
  }
}
