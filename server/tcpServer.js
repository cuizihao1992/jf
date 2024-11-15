const net = require('net');
const db = require('./db');
const { saveDeviceStatus, logCommand } = require('./utils');

const clients = new Map();

function startTCPServer(port) {
  const server = net.createServer((socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected: ${clientInfo}`);
    clients.set(clientInfo, socket);

    socket.on('data', async (data) => {
      console.log(`Data received from ${clientInfo}:`, data);

      // 示例：处理心跳包和命令响应
      await saveDeviceStatus(clientInfo, data);
    });

    socket.on('end', () => {
      console.log(`Client disconnected: ${clientInfo}`);
      clients.delete(clientInfo);
    });

    socket.on('error', (err) => {
      console.error(`Error from ${clientInfo}:`, err);
    });
  });

  server.listen(port, () => {
    console.log(`TCP Server listening on port ${port}`);
  });

  return server;
}

module.exports = { startTCPServer, clients };
