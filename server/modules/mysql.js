const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '3510b38g11.zicp.fun',
  port: 57768,
  // host: 'localhost',
  // port: 3306,
  user: 'root',
  password: '123456', // 替换为你的密码
  database: 'jf', // 替换为你的数据库名
});

module.exports = pool;
