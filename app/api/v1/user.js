const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../model/user')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/user',
})

// 注册
router.post('/register', async ctx => {
  const v = await new RegisterValidator().validate(ctx)
  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname'),
  }
  await User.createCategory(user)
  success()
})

module.exports = router
