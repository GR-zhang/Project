// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('../api', true, /\.js$/);

const apiFuncs = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath);
  // 合并所有请求函数到一个对象中
  return { ...modules, ...value.default};
}, {})

export default apiFuncs