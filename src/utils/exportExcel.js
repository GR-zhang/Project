// 将文件流转换成excel文档  注意请求时axios对象配置 responseType='blob'
import { Message } from 'element-ui'
export const exportExcel = (res, name) => {
  if (res.type == 'application/json') { // 失败的处理
    const reader = new FileReader()
    reader.readAsText(res, 'utf-8')
    reader.onload = () => {
      // 处理报错信息 JSON.parse(reader.result)拿到报错信息
      Message({
        message: JSON.parse(reader.result).msg,
        type: 'error'
      })
    }
  } else {
    var downloadElement = document.createElement('a')
    var blob = new Blob([res], {
      type: 'application/octet-stream;charset=UTF-8'
    })
    var href = window.URL.createObjectURL(blob) // 创建下载的链接
    downloadElement.href = href
    downloadElement.download = name // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放掉blob对象
    
    // 提示文件正在导出中
    Message({
      message: '文件正在导出中...',
      type: 'success'
    })
  }
}