

import ImageCompressor from 'js-image-compressor'

/**
 * @description: 图片压缩使用插件
 * @param { object } file
 * @return { object }
 */
export function imgCompress(file) {
  return new Promise((reslove, reject) => {
    try {
      new ImageCompressor({
        file,
        quality: 0.5,
        success: (blobData) => {
          
          reslove(new File([blobData], blobData.name));
        },
      });
    } catch (error) {
      throw error;
      reject(error);
    }
  })
}

export function imgCompress_gif(file) {
  // console.log('原始file', file);
  return new Promise((reslove, reject) => {
    try {
      if (window.FileReader) {
        var fr = new FileReader()
        fr.readAsArrayBuffer(file)
        fr.onload = function(e) {
          var colors = 256 // 介于0~256之间数值越小压缩后文件越小
          // eslint-disable-next-line no-undef
          var result = gifmin(fr.result, colors) // 二进制文件流
          console.log(result)
          var obj = new Blob([result], { // 转换成Blob对象
            type: 'application/octet-stream'
          })
          let handleFile = new window.File([obj], file.name, { // 转换成file文件
            type: file.type
          })
          // console.log('压缩后gif file', handleFile);
          reslove(handleFile);
          // that.gifUrl = window.URL.createObjectURL(file)
          // that.formData.gifUrl = 'yes'
        }
      }
    }catch(e) {
      reject(e);
      throw e;
    }
  })
}