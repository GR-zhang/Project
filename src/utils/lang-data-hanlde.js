/******** 多语言数据处理*/
import { cachePrefix } from '@/settings'
import API from '@/api'

// 1、sessionStorage缓存
//多语言列表
let langListKey = `${cachePrefix}langList`;
export async function setLangList() {
  let res = await API.get_lang_list();
  let options = (res.data.rows || []).map(item => ({
    label: item.description,
    value: String(item.id),
    locale: item.lang
  }))

  // ps: 数组对象必须排序，否则会造成多语言表单校验失效！！！
  sessionStorage.setItem(langListKey, JSON.stringify(options.sort(sortObj('value'))));
};
export function getLangList() {
  return JSON.parse(sessionStorage.getItem(langListKey)) || [];
}
function sortObj(property){
  return function(obj1,obj2){
  var data1=obj1[property]
  var data2=obj2[property]
  return data1-data2   //升序
  // return data2-data1   //降序
  }
}
//当前语言
let localeKey = `${cachePrefix}locale`;
export async function setLocale(newLocale) {
  if(newLocale) {// 切换语言
    localStorage.setItem(localeKey, newLocale);
  }else {
    let res = await API.get_defaultLang();
    let defaultLangInfo = getLangList().filter(item => item.value == res.data)[0];
    localStorage.setItem(localeKey, defaultLangInfo.locale);
  }
};
export function getLocale() {
  return localStorage.getItem(localeKey);
}
export function getValue() {
  let locale = getLocale();
  let defaultLangInfo = getLangList().filter(item => item.locale == locale)[0];
  return defaultLangInfo.value
}

// 2、查询与提交数据 相互转化
export function queryDataConvert(originList) {
  let finnalData = {};

  (originList || []).forEach(item => {
    finnalData[String(item.langId)] = item;
  })
  
  return finnalData;
}
export function submitDataConvert(originData) {
  return Object.keys(originData).map(key => originData[Number.parseInt(key)])
}

// 3、添加时生成占位数据
/**
 * @param { object } fieldsObj 生成默认数据对象的字段 
*/
export function addPlaceholderData(fieldsObj) {
  let finnalData = {};

  getLangList().forEach(item => {
    finnalData[item.value] = {
      langId: Number.parseInt(item.value),
      ...fieldsObj
    }
  })

  return finnalData;
}

