class HttpException extends Error {
  constructor(msg = '服务器错误', errorCode = 10000, code = 200) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

// 参数异常类
class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

// 成功类
class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || 'OK'
    this.errorCode = errorCode || 0
  }
}

// 资源未找到异常
class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '资源未找到'
    this.errorCode = errorCode || 10000
  }
}

// 禁止访问
class Forbidden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 401
  }
}

// 验证未通过异常
class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
  }
}

// 已存在
class Existing extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '已存在'
    this.errorCode = errorCode || 10004
  }
}

// 非法日期
class NotIllegalDate extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '非法日期'
    this.errorCode = errorCode || 10004
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbidden,
  Existing,
  NotIllegalDate,
}
