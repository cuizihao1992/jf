const express = require('express');
const cors = require('cors');
const verifyToken = require('./middlewares/authMiddleware');
const responseFormatter = require('./middlewares/responseFormatter');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const snakeCaseMiddleware = require('./middlewares/snakeCaseMiddleware');
const createRouter = require('./middlewares/createRouter');
const authRouter = require('./modules/auth.js');
const modules = require('./modules'); // 模块统一导出

const app = express();
const PORT = 3000;
const isVerify = false; // 是否启用验证中间件

// 中间件
app.use(express.json()); // 替换 body-parser
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);
app.use(snakeCaseMiddleware);
app.use(responseFormatter);

// 登录和注册接口
app.use('/auth', authRouter);

// 动态注册模块路由
registerRoutes(
  app,
  modules,
  isVerify ? verifyToken : (req, res, next) => next()
);

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/**
 * 注册模块路由
 * @param {Object} app - Express 实例
 * @param {Object} modules - 路由模块映射
 * @param {Function} authMiddleware - 认证中间件
 */
function registerRoutes(app, modules, authMiddleware) {
  Object.entries(modules).forEach(([path, module]) => {
    app.use(path, authMiddleware, createRouter(module));
  });
}
