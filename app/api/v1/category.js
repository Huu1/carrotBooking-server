const Router = require('koa-router')
const { ClassValidator } = require('../../validators/validator')
const { Category } = require('../../model/category')
const { success } = require('../../lib/helper')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
  prefix: '/v1/category',
})

// 添加类目
router.post('/add', new Auth().m, async ctx => {
  const v = await new ClassValidator().validate(ctx)
  const category = {
    title: v.get('body.title'),
    icon: v.get('body.icon'),
  }
  await Category.createCategory(category);
  success();
})

router.get('/list', async ctx => {
  const data = await Category.getCategoryList();
  ctx.body = {
    data,
    error_code: 0,
  }
})

module.exports = router
