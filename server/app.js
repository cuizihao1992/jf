const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./middlewares/authMiddleware'); // Token 验证中间件
const responseFormatter = require('./middlewares/responseFormatter'); // 引入格式化中间件
const { createRouter } = require('./global');
const authRouter = require('./modules/auth.js');

// 导入各模块
const modules = {
  '/device-logs': require('./modules/deviceLogs'),
  '/device-tasks': require('./modules/deviceTasks.js'),
  '/device-types': require('./modules/deviceTypes'),
  '/devices': require('./modules/devices'),
  '/regions': require('./modules/regions'),
  '/scheduled-tasks': require('./modules/scheduledTasks'),
  '/device-reviews': require('./modules/deviceReviews.js'),
  '/device-status-history': require('./modules/deviceStatusHistory'),
  '/tasks': require('./modules/tasks'),
  '/task-errors': require('./modules/taskErrors'),
  '/user-review': require('./modules/userReview'),
  '/user': require('./modules/user'),
};

const app = express();

const PORT = 3000;

// 是否启用验证中间件
const isVerify = false;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(responseFormatter);
// 登录和注册接口不需要验证
app.use('/auth', authRouter);

// 动态注册路由
Object.entries(modules).forEach(([path, module]) => {
  app.use(
    path,
    isVerify ? verifyToken : (req, res, next) => next(), // 条件中间件
    createRouter(module)
  );
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
