const bcrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const { db } = require('../../core/db')

class User extends Model {
  // 邮箱登录
  static async verifyEmailPassword(email, plainPassword) {
    const user = await User.findOne({
      where: {
        email,
      },
    })
    if (!user) {
      throw new global.errs.NotFound('账号不存在')
    }
    const correct = bcrypt.compareSync(plainPassword, user.password)
    if (!correct) {
      throw new global.errs.AuthFailed('密码不正确')
    }
    return user
  }

  // 小程序登录
  static async getUserByOpenid(openid) {
    return User.findOne({
      where: {
        openid,
      },
    })
  }

  // 小程序用户注册
  static async registerByOpenid(openid) {
    return User.create({ openid })
  }
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        const salt = bcrypt.genSaltSync(10)
        const psw = bcrypt.hashSync(val, salt)
        this.setDataValue('password', psw)
      },
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true,
    },
  },
  {
    sequelize: db,
    tableName: 'user',
  },
)

module.exports = {
  User,
}
