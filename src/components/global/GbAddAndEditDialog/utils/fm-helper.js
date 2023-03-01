export default {
  /**文件类型变量*/
  videoFormat: '.mp4,.webm,.ogg',
  imgFormat: '.jpg,.jpeg,.png,.gif',

  /**
   * 获取文件大小描述
   * @param size 单位字节 B
   */
  getSizeText(size) {
    if (size <= 0) {
      return '10MB'
    } else if (size < 1024) {
      return size + 'B'
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else if (size < 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    } else {
      return '10MB'
    }
  },

  /**文件类型校验*/
  isVideo(url) {
    return /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i.test(url);
  },
  isImage(url) {
    return /^https?.+\.(jpg|png|jpeg|gif|bmp|webp)$/i.test(url);
  },
  
  /**生成文件上传提示信息*/
  generateFileUploaderTip(limit) {
    return limit.isImg?
      `上传${limit.accept}格式图片，图片大小不能超过${this.getSizeText(limit.size)}！`
      :
      `上传${limit.accept}格式视频，视频大小不能超过${this.getSizeText(limit.size)}！`;
  },

  /**生成文件上传提示信息(多图片)*/
  generateFilePickerTip_multiImg(limit) {
    return `上传${limit.accept}格式图片，图片大小不能超过${this.getSizeText(limit.size)}！`
  }
}