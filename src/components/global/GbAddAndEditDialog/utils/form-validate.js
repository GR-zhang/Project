/**根据modalFormItems生成表单rules*/
export let generateFormRulesByModalFormItems = (modalFormItems) => {
  let finnalRules = {};

  modalFormItems.forEach((item, index) => {
    let ruleArr = [];

    // 不为空验证项
    if(item.required) {
      let handleTrigger = ['select', 'radio', 'select-member-rank'].includes(item.type) ? 'change' : 'blur';

      let ruleObj = {required: true, message: `${item.label}不能为空`, trigger: handleTrigger};
      ruleArr.push(ruleObj);
    }
    // 除了不能为空，添加其他的验证项
    if(item.regExp) {
      // 正则表达式对象
      const regExpMapObj = {
        'email': /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/,
        'phone': /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        'url': /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/
      }      

      let ruleObj = {
        pattern: regExpMapObj[item.regExp],
        message: `请输入正确${item.label}`,
        trigger: 'blur'
      }
      ruleArr.push(ruleObj)
    }
    
    // 自定义校验规则验证项目
    if(item.customRules) {
      ruleArr.push(...item.customRules);
    }

    // 验证项数组不为空，才给该 字段 添加验证规则
    if(ruleArr.length != 0) {
      finnalRules[item.prop] = ruleArr;
    }
  })

  return finnalRules;
} 