const dotenv = require('dotenv');
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
console.log(process.env.NODE_ENV);
console.log(process.cwd());
console.log(envFile);
dotenv.config({ path: envFile });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  // host: process.env.DB_HOST || 'localhost',
  // port: process.env.DB_PORT || 3306,
  host: process.env.DB_HOST || '3510b38g11.zicp.fun',
  port: process.env.DB_PORT || 57768,
  user: 'root',
  password: '123456', // 替换为你的密码
  database: 'jf2', // 替换为你的数据库名
});

module.exports = pool;
