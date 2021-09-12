/* eslint-disable implicit-arrow-linebreak */
const jwt = require('jsonwebtoken')

// eslint-disable-next-line func-names
const findMembers = function (instance, {
  prefix,
  specifiedType,
  filter,
}) {
  // 递归函数
  /* eslint no-underscore-dangle: 0 */
  // eslint-disable-next-line no-shadow
  function _find(instance) {
    // 基线条件（跳出递归）
    // eslint-disable-next-line no-proto
    if (instance.__proto__ === null) return []

    let names = Reflect.ownKeys(instance)
    names = names.filter((name) =>
      // eslint-disable-next-line no-use-before-define
      _shouldKeep(name))

    // eslint-disable-next-line no-proto
    return [...names, ..._find(instance.__proto__)]
  }

  // eslint-disable-next-line consistent-return
  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true
      }
    }
    if (prefix) {
      if (value.startsWith(prefix)) {
        return true;
      }
    }
    if (specifiedType) {
      if (instance[value] instanceof specifiedType) {
        return true
      }
    }
  }

  return _find(instance)
}

// 生成Token
// eslint-disable-next-line func-names
const generateToken = function (uid, scope) {
  const { secretKey } = global.config.security
  const { expiresIn } = global.config.security
  const token = jwt.sign({
    uid,
    scope,
  }, secretKey, {
    expiresIn,
  })
  return token
}

const DateReg = /^(\d{1,4})(-)(\d{1,2})\2(\d{1,2})$/;

const checkDate = (date) => {
  if (!date) {
    return {
      res: 4,
      msg: '日期不能为空',
    }
  }
  if (date.length === 10) {
    const r = date.match(DateReg);
    if (r === null) {
      // 不符合YYYY-MM-DD格式
      return {
        res: 2,
        msg: '不符合YYYY-MM-DD格式',
      }
    }
    // 除去不正确时间如1234-45-56
    const [, year, , month, day] = r;
    if (year < 1970 || (+month < 1 || +month > 12) || (day < 1 || day > 31)) {
      return {
        res: 3,
        msg: '非法日期',
      }
    }
    return {
      res: 1,
    }
  }
  return {
    res: 2,
    msg: '不符合YYYY-MM-DD格式',
  };
}

module.exports = {
  findMembers,
  generateToken,
  DateReg,
  checkDate,
}
