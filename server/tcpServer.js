const net = require('net');
const db = require('./db');
const {
  saveDeviceStatus,
  logCommand,
  saveCommandResponse,
} = require('./utils');

const clients = new Map();
const pendingRequests = new Map();

function startTCPServer(port) {
  const server = net.createServer((socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Client connected: ${clientInfo}`);
    clients.set(clientInfo, socket);

    socket.on('data', async (data) => {
      console.log(`Data received from ${clientInfo}:`, data);

      // 检查是否包含请求ID
      const requestId = data.slice(0, 4).toString('hex'); // 假设前4字节是请求ID
      const clientRequests = pendingRequests.get(clientInfo) || {};
      const request = clientRequests[requestId];

      if (request) {
        const { command, resolve } = request;
        await saveCommandResponse(clientInfo, command, data);
        resolve(data);
        delete clientRequests[requestId];
        pendingRequests.set(clientInfo, clientRequests);
      }

      // 示例：处理心跳包和额外状态保存
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

async function sendTCPCommand(clientInfo, command) {
  return new Promise((resolve, reject) => {
    const client = clients.get(clientInfo);
    if (!client) {
      return reject(new Error('Client not connected'));
    }

    // 生成唯一请求ID（例如前4字节随机数）
    const requestId = Buffer.alloc(4);
    requestId.writeUInt32BE(Math.floor(Math.random() * 0xffffffff), 0);

    const fullCommand = Buffer.concat([requestId, command]);

    // 保存请求以便匹配响应
    const clientRequests = pendingRequests.get(clientInfo) || {};
    clientRequests[requestId.toString('hex')] = {
      command: fullCommand,
      resolve,
    };
    pendingRequests.set(clientInfo, clientRequests);

    client.write(fullCommand, (err) => {
      if (err) {
        delete clientRequests[requestId.toString('hex')];
        pendingRequests.set(clientInfo, clientRequests);
        return reject(err);
      }
      console.log(`Command sent to ${clientInfo}:`, fullCommand);
      logCommand(clientInfo, fullCommand, null).catch(console.error);
    });
  });
}

module.exports = { startTCPServer, clients, sendTCPCommand };
