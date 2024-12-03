const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModule = require('./user'); // 假设 user 模块管理用户数据

const SECRET_KEY = 'your_secret_key';

async function login(req, res) {
  const { username, password } = req.body;

  // 检查用户是否存在
  const users = await userModule.query({ username });
  if (users.length === 0) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const user = users[0];

  // 验证密码
  // const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = password == user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // 生成 JWT
  const token = jwt.sign(
    { userId: user.user_id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  // 更新登录时间和IP
  await userModule.update(user.user_id, {
    last_login: new Date(),
    login_ip: req.ip,
    token, // 可选，存储当前的 JWT
  });

  res.json({ message: 'Login successful', token, user });
}
async function logout(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 解码 JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    // 清空用户的 token（可选，根据需求）
    await userModule.update(decoded.userId, { token: null });

    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // 将用户信息存储在请求对象中
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
module.exports = {
  login,
  logout,
  authenticate,
};
