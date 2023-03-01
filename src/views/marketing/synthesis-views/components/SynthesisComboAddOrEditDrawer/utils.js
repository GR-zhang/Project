/** 判断表格每一行数据是否存在空值*/
export const tableRowContainNull = (tableList) => {
  return tableList.some((item) => {
    return Object.keys(item).some(key => {
      if(key == 'productList') {
        return !item[key].length
      }
      return !item[key];
    })
  })
}