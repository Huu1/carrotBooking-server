module.exports = {
  environment: 'dev', // prod 为生产环境 dev 为开发环境
  database: {
    dbName: 'carrot',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
  },
  security: {
    secretKey: 'kpojpojpo21j3po21j4op21j4op21pk3o2pokpodsafmldmMLK',
    expiresIn: 3600 * 24 * 30,
  },
  wx: {
    appId: 'wx41dfbbbd61642db0',
    appSecret: '95e2af87667a75c32f12ef57ae8f99c5',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
  },
  host: 'http://localhost:10086/',
}
