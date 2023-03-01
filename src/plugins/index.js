import apiFuncs from '@/api'
import { exportExcel } from '@/utils/exportExcel';
import gbCpn from '@/components/global'
import { parseTime } from '@/utils'
import { setLangList, setLocale, getLocale } from '@/utils/lang-data-hanlde'
// import '@/styles/no-multi-lang.scss'

export default {
  install (Vue) {
    setLangList();// sessionStorage缓存: 多语言列表
    setLocale(getLocale());// sessionStorage缓存: 选择语言
    Vue.prototype.$api = apiFuncs;
    Vue.prototype.$exportExcel = exportExcel;
    Vue.use(gbCpn);
    
    Vue.filter('parseTime', parseTime);
  }
}