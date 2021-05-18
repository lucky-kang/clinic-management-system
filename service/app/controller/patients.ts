//用于解析用户的输入，处理后返回相应的结果
const Controller = require('egg').Controller;

const Op = require('sequelize').Op

const  toInt = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

// 判断某个属性是否有值（为undefined、null、'')
const hasValue = (value) => {
  let isEmpty
  switch (value) {
    case undefined:
      isEmpty = true
      break;
    case null:
      isEmpty = true
      break;
    case '':
      isEmpty = true
      break;
    default:
      isEmpty = false
      break;
  }
  return !isEmpty
}

const randomNumber = (min:number, max:number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomAvatar = () => {
  const avatarList = [
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3919792586,2575562352&fm=26&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2974115506,2044780524&fm=26&gp=0.jpg',
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3249603416,2272704334&fm=26&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1941403315,3810267570&fm=26&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1623927837,3759599681&fm=26&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1110347155,3107731482&fm=26&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1928209595,2458515969&fm=26&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2514987911,2694725966&fm=26&gp=0.jpg',
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3961188352,3110718656&fm=26&gp=0.jpg',
      'https://ww2.sinaimg.cn/bmiddle/0065N4Qlgy1gd1ngjt3mtj30zk0k0h54.jpg',
      'https://ww2.sinaimg.cn/square/0065N4Qlgy1gd1ngprnehj30zk0k0qti.jpg',
      'https://ww1.sinaimg.cn/orj360/005Nf4LQgy1gd1oa49dk0j30u019ctf2.jpg',
      'https://wx3.sinaimg.cn/mw1024/a6be0498ly1gagd6m22waj21bq24hhdt.jpg',
      'https://wx2.sinaimg.cn/mw1024/a6be0498ly1gcn0h7vtxrj20tc16g793.jpg',
      'https://wx3.sinaimg.cn/mw1024/a6be0498ly1gcj93ieamuj20u0140wlm.jpg',
      'https://wx2.sinaimg.cn/mw1024/a6be0498gy1ful82pep31j21ru2tcnpj.jpg',
      'https://wx2.sinaimg.cn/mw1024/a6be0498gy1fpbenfizrjj20qo0zin3d.jpg',
  ]
  return avatarList[randomNumber(0, avatarList.length)]
}

class PatientsController extends Controller {
  async index() {
    const ctx = this.ctx;
    console.log('ctx.query', ctx.query)
    const { pageNum = 1, pageSize = 9} = ctx.query   // 获取参数
    const requestQuery = JSON.parse(ctx.query.query) // 格式化参数
    let where: any = {}                              // 定义查询条件
    Object.keys(requestQuery).map(key => {           // 校验查询条件
      if (requestQuery.hasOwnProperty(key)) {
      console.log('requestQuery', requestQuery,key)
        if (hasValue(requestQuery[key])) {
          if (key === 'createdTime') {
            where.createdTime = {
              [Op.between]:requestQuery[key]
            }
          }
          if (key === 'admissionStatus' || key === 'vipLevel' || key === 'name' || key === 'phone') {
            where[key] = requestQuery[key]
          }
        }}
    })
    const query = { limit: toInt(pageSize), offset: (toInt(pageNum)-1)*toInt(pageSize),where };// 组装参数
    // 调用ctx进行业务处理查询所有患者
    const allData = await ctx.model.Patients.findAll({where}); 
    // 调用ctx进行业务处理查询符合查询条件的患者
    const data = await ctx.model.Patients.findAll(query);
    console.log(randomAvatar(),'randomAvatar()')
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      obj.avatar = randomAvatar();
    }    
    ctx.body = {
      code: '1',
      data:{
        list: data,
        total:allData.length
      }
    }
  }
  // 获取患者详情
  async show() {
    const ctx = this.ctx;
    const patients = await ctx.model.Patients.findByPk(toInt(ctx.query.id));
    if (!patients) {
      ctx.body = {
        code: '0',
        msg: '该患者不存在'
      }
      return 
    }
    // 将患者转为数组
    const roles = patients.role ? patients.role.split(' ').map(role => toInt(role)) : [];
    const address = patients.address ? patients.address.split(' ') : [];
    patients.role = roles
    patients.address = address
    ctx.body = {
      code: '1',
      data: patients
    }
  }
  // 创建患者
  async create() {
    const ctx = this.ctx;
    const data = {
      ...ctx.request.body,
      createdTime: new Date()
    }
    await ctx.model.Patients.create(data);
    ctx.status = 201;
    ctx.body = {
      code: '1',
      msg: '操作成功'
    };
  }
  // 更新患者信息
  async update() {
    const ctx = this.ctx;
    const { id: emplyoeeId, ...others } = ctx.request.body;

    const id = toInt(emplyoeeId);
    const patient = await ctx.model.Patients.findByPk(id);
    if (!patient) {
      ctx.body = {
        code: '0',
        msg: '该患者不存在'
      };
      return;
    }
    await patient.update(others);
    ctx.body = {
      code: '1',
      msg:'操作成功'
    };
  }
  // 删除患者
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.request.body.id);
    const patient = await ctx.model.Patients.findByPk(id);
    if (!patient) {
      ctx.body = {
        code: '0',
        msg: '该患者不存在'
      }
      return;
    }
    await patient.destroy();
    ctx.body = {
      code: '1',
      msg: '操作成功'
    }
  }
}

module.exports = PatientsController;