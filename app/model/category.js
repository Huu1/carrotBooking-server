const { isNumber } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('../../core/db');
const { checkDate, checkMonth } = require('../../core/util');

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

  static async getCategoryList() {
    const res = await Category.findAll({
      attributes: [
        'title',
        'id',
        'icon',
      ],
      where: {
        visible: '1',
      },
      order: ['sort'],
    });
    return res;
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

  static async delExpend(data) {
    const { expendId, uid } = data;

    const existExpend = await Expend.findOne({
      where: {
        id: expendId,
        uid,
      },
    });
    if (!existExpend) {
      throw new global.errs.NotFound('此记录不存在');
    }
    await existExpend.destroy();
  }

  static async getMonthExpend(data) {
    const { date, uid } = data;

    const { res, msg, yearMonth = [] } = checkMonth(date);

    if (res !== 1) {
      throw new global.errs.NotIllegalDate(msg);
    }

    const [year, month] = yearMonth;

    const whereOpt = {
      [Sequelize.Op.and]: [
        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
      ],
      uid,
    }

    const list = await Expend.findAll({
      where: whereOpt,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['title', 'icon'],
      }],
      attributes: [
        'value',
        'describe',
        'id',
        'created_at',
        [Sequelize.fn('DATE', Sequelize.col('date')), 'day'],
      ],
      order: [['date', 'DESC'], ['created_at', 'DESC']],
    })

    const sum = await Expend.sum('value', {
      where: whereOpt,
    })

    return { list, sum };
  }

  static async countExpend(data) {
    const { uid, date, type } = data;

    if (!['year', 'month'].includes(type)) {
      throw new global.errs.NotIllegalDate('type必须为year或month');
    }

    let whereOpt;

    if (type === 'year') {
      const newDate = +date;
      if (!isNumber(newDate)) {
        throw new global.errs.NotIllegalDate('年份错误');
      }
      whereOpt = {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), +date),
        ],
        uid,
      }
    } else if (type === 'month') {
      const { res, msg, yearMonth = [] } = checkMonth(date);
      if (res !== 1) {
        throw new global.errs.NotIllegalDate(msg);
      }
      const [year, month] = yearMonth;
      whereOpt = {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year),
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
        ],
        uid,
      }
    }

    const list = await Expend.findAll({
      where: whereOpt,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['title', 'icon'],
      }],
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('value')), 'value'],
        [Sequelize.fn('COUNT', Sequelize.col('value')), 'count'],
      ],
      group: 'category_id',
    })

    const sum = await Expend.sum('value', {
      where: whereOpt,
    })

    list.forEach(i => {
      i.setDataValue('ratio', (i.getDataValue('value') / sum).toFixed(2))
    })

    return { list, sum };
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
