const Router = require('koa-router')
const { ClassValidator } = require('../../validators/validator')
const { Category } = require('../../model/category')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/category',
})

// 添加类目
router.post('/add', async ctx => {
  const v = await new ClassValidator().validate(ctx)
  const category = {
    title: v.get('body.title'),
    icon: v.get('body.icon'),
  }
  await Category.addExpend(category);
  success();
})

module.exports = router
