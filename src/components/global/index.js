// 全局组件
import { default as GbFormQuery } from './GbFormQuery'
import { default as GbTableDisplay } from './GbTableDisplay'
import { default as GbAddAndEditDialog } from './GbAddAndEditDialog'
import { default as GbPagination } from './GbPagination'
import { default as GbInputNumber } from './GbInputNumber'

// 非全局组件
export { default as GbPickerDatetimeRange } from './GbPickerDatetimeRange'
export { default as GbSelectApi } from './GbSelectApi'
export { default as GbSelectArea } from './GbSelectArea'
export { default as GbBackTop } from './GbBackTop'

export default {
  install (Vue) {
    // 注册全局组件
    Vue.component('GbFormQuery', GbFormQuery);
    Vue.component('GbTableDisplay', GbTableDisplay);
    Vue.component('GbAddAndEditDialog', GbAddAndEditDialog);
    Vue.component('GbPagination', GbPagination);
    Vue.component('GbInputNumber', GbInputNumber);
  }
}