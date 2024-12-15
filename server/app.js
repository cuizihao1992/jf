const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { fork } = require('child_process'); // 引入 child_process 模块
const verifyToken = require('./middlewares/authMiddleware');
const responseFormatter = require('./middlewares/responseFormatter');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const snakeCaseMiddleware = require('./middlewares/snakeCaseMiddleware');
const createRouter = require('./middlewares/createRouter');
const authRouter = require('./modules/auth.js');
const modules = require('./modules'); // 模块统一导出
const { startTCPServer } = require('./tcpServer');
const config = require('./config');
const app = require('./apiServer');

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(loggerMiddleware);
app.use(snakeCaseMiddleware);
app.use(responseFormatter);

// 登录和注册接口
app.use('/auth', authRouter);

// 动态注册模块路由
const isVerify = true; // 是否启用验证中间件

registerRoutes(
  app,
  modules,
  isVerify ? verifyToken : (req, res, next) => next()
);

// WebSocket 服务
wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');
  [66, 67, 68].forEach((i) => {
    ws.send(JSON.stringify({ deviceId: i }));
  });
});

// 广播设备状态给所有 WebSocket 客户端
function broadcastStatus(statusData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(statusData));
    }
  });
}

// 启动 TCP 服务器并与 WebSocket 集成
config.server.tcpPorts.forEach((port) => startTCPServer(port, broadcastStatus));

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// 启动 HTTP 和 WebSocket 服务器
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // startTaskScheduler(); // 启动定时任务子进程
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

/**
 * 启动定时任务子进程
 */
function startTaskScheduler() {
  const taskScheduler = fork('./modules/taskScheduler.js'); // 启动子进程

  // 接收子进程消息
  taskScheduler.on('message', (msg) => {
    console.log('[TaskScheduler]', msg);
  });

  // 监听子进程退出
  taskScheduler.on('exit', (code) => {
    console.log(`[TaskScheduler] exited with code ${code}`);
  });

  // 处理子进程错误
  taskScheduler.on('error', (err) => {
    console.error('[TaskScheduler] Error:', err);
  });
}
