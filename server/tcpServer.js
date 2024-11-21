const net = require('net');
const { processData } = require('./processData.js');
const { clients } = require('./global.js');
function startTCPServer(port, wsCallback) {
  const server = net.createServer((socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`${port}:client created: ${clientInfo}`);
    clients.set(clientInfo, socket);

    // processData2(socket);
    socket.on('data', async (data) => {
      processData(socket, data);

      wsCallback({
        deviceId: 66,
        angle: 45,
        gps: '30.6586, 104.0648',
        power: 12.5,
        isOnline: true,
        imageUrl: 'https://example.com/image.jpg',
        timestamp: new Date().toLocaleString(),
      });
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

module.exports = { startTCPServer };
