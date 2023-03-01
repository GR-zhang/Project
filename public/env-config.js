let VUE_APP_BASE_API = '';
let VUE_APP_tinymceCDN = '';

try {
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境');
    // 开发环境
    VUE_APP_BASE_API = '/api-proxy';
    VUE_APP_tinymceCDN = '/tinymce-all-in-one/tinymce.min.js';
  } else {
    // 生产环境
    console.log('生产环境');
    VUE_APP_BASE_API = window.location.origin + '/nft_backend';
    VUE_APP_tinymceCDN = window.location.origin + '/backstage' + '/tinymce-all-in-one/tinymce.min.js';
  }
} catch(e) {
  throw e;
}

window.__ENV__ = {
  VUE_APP_BASE_API,
  VUE_APP_tinymceCDN
}