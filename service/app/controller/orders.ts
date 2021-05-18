const Controller = require('egg').Controller;

const Op = require('sequelize').Op

const  toInt = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

// 判断某个属性是否有值（为undefined、null、‘’)
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

class OrdersController extends Controller {
  async index() {
    const ctx = this.ctx;
    console.log('ctx.query', ctx.query)
    const { pageNum = 1, pageSize = 10} = ctx.query
    const requestQuery = JSON.parse(ctx.query.query)
    let where: any = {}
    Object.keys(requestQuery).map(key => {
      if (requestQuery.hasOwnProperty(key)) {
        if (hasValue(requestQuery[key])) {
          console.log('requestQuery',requestQuery,key)
          if (key === 'createdTime') {
            where.createdTime = {
              [Op.between]:requestQuery[key]
            }
          }
          if (key === 'type' || key==='chargeStatus' || key==='number' || key==='name') {
            where[key]= requestQuery[key]
          }
          if (key === 'search') {
            where[Op.or] = [
              {
                name: requestQuery[key].trim(),
              },
              {
                number: requestQuery[key].trim()
              }
            ]
          }
        }}
    })
    const query = { limit: toInt(pageSize), offset: (toInt(pageNum)-1)*toInt(pageSize),where };
    // // 所有的患者数据
    const allData = await ctx.model.Orders.findAll({where});
    // // 按条件查询患者
    const data = await ctx.model.Orders.findAll(query);
    
    ctx.body = {
      code: '1',
      data:{
        list: data,
        total:allData.length
      }
    }
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Orders.findByPk(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const { name, age } = ctx.request.body;
    const user = await ctx.model.Orders.create({ name, age });
    ctx.status = 201;
    ctx.body = user;
  }

  // 更新订单信息
  async update() {
    const ctx = this.ctx;
    const { id, ...others } = ctx.request.body;

    const id_ = toInt(id);
    const order = await ctx.model.Orders.findByPk(id_);
    if (!order) {
      ctx.body = {
        code: '0',
        msg: '该订单不存在'
      };
      return;
    }
    await order.update(others);
    ctx.body = {
      code: '1',
      msg:'操作成功'
    };
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.Orders.findByPk(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}

export {}

module.exports = OrdersController;
