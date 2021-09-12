const { LinValidator, Rule } = require('../../core/lin-validator')
const { User } = require('../model/user')
const { LoginType } = require('../lib/enum')

// 校验LoginType类型
function checkLoginType(vals) {
  let type = vals.body.type || vals.path.type
  if (!type) {
    throw new Error('type是必传参数')
  }
  type = parseInt(type, 10)
  if (!LoginType.isThisType(type)) {
    throw new Error('type参数不合法')
  }
}

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [new Rule('isInt', '需要传入正整数', { min: 1 })]
  }
}

// 注册验证
class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [new Rule('isEmail', '不符合Email规范')]
    this.password1 = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', {
        min: 6,
        max: 32,
      }),
      new Rule(
        'matches',
        '密码不符合规范，请包含特殊字符',
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]',
      ),
    ]
    this.password2 = this.password1
    this.nickname = [new Rule('isLength', '昵称长度不符合规范', {
      min: 4,
      max: 32,
    })]
  }

  // 验证两个密码相同
  validatePassword(vals) {
    const psw1 = vals.body.password1
    const psw2 = vals.body.password2
    if (psw1 !== psw2) {
      throw new Error('前后密码必须相同')
    }
  }

  // 验证邮箱
  async validateEmail(vals) {
    const { email } = vals.body
    const user = await User.findOne({ where: { email } })
    if (user) {
      throw new Error('email已经存在')
    }
  }
}

// 凭证验证
class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [new Rule('isLength', '不符合账号规则', {
      min: 4,
      max: 32,
    })]
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少六个字符', {
        min: 6,
        max: 128,
      }),
    ]
  }

  // 如果使用邮箱登录，必传密码
  validateEmailPassword(vals) {
    const isEmail = vals.body.type === LoginType.USER_EMAIL
    if (isEmail && !vals.body.secret) {
      throw new Error('密码不能为空')
    }
  }

  // 校验登录类型
  validateLoginType(vals) {
    checkLoginType(vals)
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super()
    this.token = [new Rule('isLength', '不允许为空', { min: 1 })]
  }
}

// 新增记账类目验证
class ClassValidator extends LinValidator {
  constructor() {
    super()
    this.title = [new Rule('isLength', '不允许为空', { min: 2 })];
    this.icon = [new Rule('isLength', '不允许为空', { min: 2 })];
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  ClassValidator,
}
