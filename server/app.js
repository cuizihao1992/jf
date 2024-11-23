const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // 引入 CORS 中间件
const verifyToken = require('./middlewares/authMiddleware'); // 导入 Token 验证中间件

const { createRouter } = require('./global');
const authRouter = require('./modules/auth.js');

// 导入各模块
const deviceLogs = require('./modules/deviceLogs');
const deviceTasks = require('./modules/deviceTasks.js');
const deviceTypes = require('./modules/deviceTypes');
const devices = require('./modules/devices');
const regions = require('./modules/regions');
const scheduledTasks = require('./modules/scheduledTasks');
const deviceReviews = require('./modules/deviceReviews.js');
const deviceStatusHistory = require('./modules/deviceStatusHistory');
const tasks = require('./modules/tasks');
const taskErrors = require('./modules/taskErrors');
const userReview = require('./modules/userReview');
const user = require('./modules/user');

const app = express();
const PORT = 3000;

app.use(cors());

// 中间件
app.use(bodyParser.json());
app.use('/auth', authRouter); // 登录和注册接口不需要验证

const isVerify = false;
function conditionalMiddleware(condition, middleware) {
  return condition ? middleware : (req, res, next) => next();
}
// 使用 Token 验证中间件保护以下接口
app.use(
  '/device-logs',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(deviceLogs)
);
app.use(
  '/device-tasks',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(deviceTasks)
);
app.use(
  '/device-types',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(deviceTypes)
);
app.use(
  '/devices',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(devices)
);
app.use(
  '/regions',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(regions)
);
app.use(
  '/scheduled-tasks',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(scheduledTasks)
);
app.use(
  '/device-reviews',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(deviceReviews)
);
app.use(
  '/device-status-history',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(deviceStatusHistory)
);
app.use(
  '/tasks',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(tasks)
);
app.use(
  '/task-errors',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(taskErrors)
);
app.use(
  '/user-review',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(userReview)
);
app.use(
  '/user',
  conditionalMiddleware(isVerify, verifyToken),
  createRouter(user)
);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
