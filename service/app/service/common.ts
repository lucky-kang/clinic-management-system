const Service = require('egg').Service; // 引入egg的Service服务类
class CommonService extends Service {
  async getNumber() {                   // 定义一个获取编号的方法
    const ctx = this.ctx;               // 使用ctx属性
    const { name } = ctx.query;         // 通过ctx属性获取路由的query参数
    let initValue :number | string= 1000// 初始化默认值
    let modelName = ''                  // 定义model名
    switch (name) {                     // 判断query参数里的name，根据不同name赋值相应的model名
      case 'department':
        modelName = 'Departments'
        break;
      case 'employee':
        modelName = 'Employees'
        break;
      case 'checkProject':
        modelName = 'CheckProjects'
        break;
      case 'role':
        modelName = 'Roles'
        break;
      case 'medicalRecordTemplate':
        modelName = 'MedicalRecordTemplates'
        initValue = 'RZ00001'
        break;
      case 'patients':
        modelName = 'Patients'
        break;
      default:
        break;
    }
    const allData = modelName && await ctx.model[modelName].findAll({  // 若model名存在则调用ctx服务查询不同model名对应的编号数据
      order:[['number','DESC']]
    })
    let number;
    if (name === 'medicalRecordTemplate') {                           // 若name等于medicalRecordTemplate，获取的编号数据重新组装做相应的+1操作
      const num = Number(allData[0].number.split('RZ')[1]) + 1;
      number = allData.length ? 'RZ' + num.toString().padStart(5, '0') : initValue;
    } else {
      number = allData.length ? allData[0].number + 1 : initValue     // 若name不等于medicalRecordTemplate，则获取数组的第一个值+1
    }
    return number
  }
}
module.exports = CommonService;