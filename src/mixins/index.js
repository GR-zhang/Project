/**常用页面混入：当页面符合单个 增删改查 时推荐使用*/
export default {
  data() {
    return {
      // 表格
      loading_table: false,
      tableList: [],
      total: 0,
      // 对话框
      dialogVisible: false,
      dialogType: 'add',
      rowData: {},
      loading_submit: false
    }
  },

  created() {
    this._getList();
  },

  methods: {
    // 过滤查询
    filterQuery() {
      this.pageParams.pageNum = 1;

      this._getList();
    }
  }
}

/**共享分页参数*/
export const sharedPageParams = {
  pageNum: 1,
  pageSize: 10
};

/**工具函数*/
export const tools = {
  // 设置数据
  async setData(vueInstance, callback) {
    vueInstance.loading_table = true
    try{
      let res = await callback();
      vueInstance.tableList = res.data.rows;
      vueInstance.total = Number.parseInt(res.data.total);
    }catch(e) {
      throw e;
    }finally {
      vueInstance.loading_table = false;
    }
  },

  // 提交
  async submitOne(vueInstance, {
    apiFuncs, //api函数,注意顺序['addApi', 'editApi']
    data  //api传参
  }) {
    try{
      let invokeApi = vueInstance.dialogType == 'add' ?
        apiFuncs[0]
        :
        apiFuncs[1];
      let tipMsg = `${vueInstance.dialogType == 'add' ? '添加' : '编辑'}成功！`;

      await invokeApi(data);
      vueInstance.loading_submit = false;
      vueInstance.dialogVisible = false;
      vueInstance.$message.success(tipMsg);
      vueInstance.dialogType == 'add' ? vueInstance.resetQuery() : vueInstance._getList();
    }catch(e) {
      throw e;
    }finally {
      vueInstance.loading_submit = false;
    }
  },

  // 删除
  delOne(vueInstance, {
    comfirmInfo, //确认消息标题
    callback  //回调函数，用于调用删除api接口
  }) {
    vueInstance.$confirm(comfirmInfo, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // ps: 修改函数this指向
      await callback.apply(vueInstance);
      
      // 刷新列表
      vueInstance._getList();
      vueInstance.$message.success('删除成功!');
    }).catch((e) => {
      throw e;
    })
  },

  // 导出
  async exportExcel(vueInstance, {
    apiFunc,//导出接口函数
    params,//兼容,有时数据过多需要分页导出
    data,//接口参数
    fileName = '文件名称'//导出excel文件名称
  }) {
    vueInstance.loading_export = true;
    try{
       
      let res = params ? await apiFunc({params, data}) : await apiFunc(data);
      // message提示在$exportExcel方法中
      vueInstance.$exportExcel(res, `${fileName}.xls`);
    }catch(e) {
      throw e;
    }finally {
      vueInstance.loading_export = false;
    }
  },

  // 上架
  upOne(vueInstance, {
    comfirmInfo, //确认消息标题
    callback  //回调函数
  }) {
    vueInstance.$confirm(comfirmInfo, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // ps: 修改函数this指向
      await callback.apply(vueInstance);
      
      // 刷新列表
      vueInstance._getList();
      vueInstance.$message.success('上架成功!');
    }).catch((e) => {
      throw e;
    })
  },
  // 下架
  downOne(vueInstance, {
    apiFunc, // 接口函数
    params = {},// 接口函数参数
    reasonField// 下架理由参数字段名称
  }) {
    function checkValue(val) {
      if(!val) {
        return '下架理由不能为空'
      }
    }

    vueInstance.$prompt('下架理由', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '请输入下架理由',
      inputValidator: checkValue
    }).then(async ({ value }) => {
      await apiFunc({
        ...params,
        [reasonField]: value
      });

      // 刷新列表
      vueInstance._getList();
      vueInstance.$message.success('下架成功!');
    }).catch((e) => {
      throw e;
    });
  },

  comfirmOne(vueInstance, {
    comfirmInfo, //确认消息标题
    successTip,
    callback  //回调函数，用于调用删除api接口
  }) {
    vueInstance.$confirm(comfirmInfo, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // ps: 修改函数this指向
      await callback.apply(vueInstance);
      
      // 刷新列表
      vueInstance._getList();
      vueInstance.$message.success(successTip);
    }).catch((e) => {
      throw e;
    })
  },
}

