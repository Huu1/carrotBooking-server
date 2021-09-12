const { Sequelize, Model } = require('sequelize');
const { db } = require('../../core/db');
const { checkDate } = require('../../core/util');

class Category extends Model {
  static async createCategory(data) {
    const { title, icon } = data;
    const hasClass = await Category.findOne({
      where: {
        title,
        icon,
      },
    });
    if (hasClass) {
      throw new global.errs.ExistingFailed('类目已存在');
    }
    return await Category.create({
      title,
      icon,
    })
  }
}

Category.init(
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
      comment: '排序',
    },
  },
  {
    sequelize: db,
    tableName: 'category',
  },
)


class Expend extends Model {
  static async addExpend(data) {
    const { value, describe, categoryId, date, uid } = data;

    const { res, msg } = checkDate(date);

    if (res !== 1) {
      throw new global.errs.NotIllegalDate(msg);
    }

    const hasCategory = await Category.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!hasCategory) {
      throw new global.errs.NotFound('类目不存在');
    }
    return await Expend.create({
      value,
      describe,
      date,
      uid,
      categoryId,
    })
  }

  static async getMonthExpend(data) {
    const { date, uid } = data;


    const res = await Expend.findAll({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), 2020),
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), 11),
        ],
      },
      include: [{
        model: Category,
        as: 'category',
      }],
    })

    return res;
  }
}

Expend.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0,
      comment: '金额',
    },
    categoryId: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: '类目',
    },
    date: Sequelize.DATE,
    describe: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: '描述',
    },
    uid: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: '用户',
    },
  },
  {
    sequelize: db,
    tableName: 'expend',
  },
)


Category.hasMany(Expend, {
  foreignKey: 'id',
});

Expend.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

module.exports = {
  Category,
  Expend,
}
