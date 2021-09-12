const Router = require('koa-router')
const { ClassValidator } = require('../../validators/validator')
const { Class } = require('../../model/class')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/class',
})

// 注册
router.post('/', async ctx => {
  const v = await new ClassValidator().validate(ctx)
  const user = {
    title: v.get('body.title'),
    icon: v.get('body.icon'),
  }
  await Class.create(user);
  success();
})

module.exports = router
