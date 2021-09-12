const Router = require('koa-router')
const { AddCategoryValidator } = require('../../validators/validator')
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
    error_code: 200,
  }

})

module.exports = router
