const { startTCPServer } = require('./tcpServer');
const config = require('./config');
const http = require('http');
const WebSocket = require('ws');
const app = require('./apiServer');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('WebSocket connection established.');
  [66, 67, 68].forEach((i) => {
    ws.send(JSON.stringify({ deviceId: i }));
  });
});
function broadcastStatus(statusData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(statusData)); // 将设备状态发送给每个连接的客户端
    }
  });
}
// 启动 TCP 服务器
config.server.tcpPorts.forEach((port) => startTCPServer(port, broadcastStatus));

// 启动 HTTP API 服务
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP API Server running on http://localhost:${PORT}`);
});
