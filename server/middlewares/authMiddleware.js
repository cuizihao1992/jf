const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // 请使用更安全的秘钥并存储在环境变量中

// 验证 Token 的中间件
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // 提取 Bearer 后的 Token 部分

  try {
    // 验证 Token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // 将解码后的用户信息存入请求对象
    next(); // 继续处理请求
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}

module.exports = verifyToken;
