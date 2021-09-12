const { Sequelize, Model } = require('sequelize');
const { db } = require('../../core/db');

class Class extends Model {
  // 小程序登录
  static async create(data) {
    const { title, icon } = data;
    const hasClass = await Class.findOne({
      where: {
        title,
        icon,
      },
    });

    if (hasClass) {
      throw new global.errs.Existing('管理员已存在');
    }
  }
}

Class.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: Sequelize.STRING,
    icon: Sequelize.STRING,
    visible: {
      type: Sequelize.STRING,
      defaultValue: '1',
      comment: '1-显示 0-隐藏',
    },
    sort: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    tableName: 'class',
  },
)

module.exports = {
  Class,
}
