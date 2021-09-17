const Router = require('koa-router')
const { AddCategoryValidator, DelCategoryValidator } = require('../../validators/validator')
const { Expend } = require('../../model/category')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
  prefix: '/v1/expend',
})

// 添加一项支出
router.post('/add', new Auth().m, async ctx => {
  const v = await new AddCategoryValidator().validate(ctx)
  const category = {
    value: v.get('body.value'),
    categoryId: v.get('body.categoryId'),
    describe: v.get('body.describe'),
    date: v.get('body.date'),
    uid: ctx.auth.uid,
  }
  await Expend.addExpend(category);
  success();
})

// 删除一项支出
router.post('/delete', new Auth().m, async ctx => {
  const v = await new DelCategoryValidator().validate(ctx)
  const expend = {
    expendId: v.get('body.expendId'),
    uid: ctx.auth.uid,
  }
  await Expend.delExpend(expend);
  success();
})

// 获取月支出
router.get('/month', new Auth().m, async ctx => {
  const { date } = ctx.query;
  const params = {
    date,
    uid: ctx.auth.uid,
  }
  const data = await Expend.getMonthExpend(params);
  ctx.body = {
    data,
    error_code: 0,
  }
})

// 年或月 统计支出
router.post('/count', new Auth().m, async ctx => {
  const { type, date } = ctx.request.body;
  const data = await Expend.countExpend({
    uid: ctx.auth.uid,
    type,
    date,
  });
  ctx.body = {
    data,
    error_code: 0,
  }
})

module.exports = router
