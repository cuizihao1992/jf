const { startTCPServer } = require('./tcpServer');
const app = require('./apiServer');
const config = require('./config');

// 启动 TCP 服务器
config.server.tcpPorts.forEach((port) => startTCPServer(port));

// 启动 HTTP API 服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`HTTP API Server running on http://localhost:${PORT}`);
});
