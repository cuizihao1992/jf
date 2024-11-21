const net = require('net');

// 缓冲区大小
const BUFFER_SIZE = 100;
const sockets = new Map(); // 存储设备的 socket 连接
let buffer = Buffer.alloc(BUFFER_SIZE);

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );

  let isOnline = false;
  let deviceId = null;

  // 监听数据事件
  socket.on('data', (data) => {
    buffer = Buffer.from(data); // 将数据存储到缓冲区

    if (!isOnline) {
      handleOnlinePacket(socket);
    } else {
      handleDataPacket(socket);
    }

    // 清空缓冲区
    buffer.fill(0);
  });

  // 监听连接关闭
  socket.on('close', () => {
    console.log(`Connection closed for device ${deviceId}`);
    if (deviceId !== null) sockets.delete(deviceId);
  });

  // 监听错误
  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// 处理上线数据包
function handleOnlinePacket(socket) {
  if (buffer[0] === 0xfe) {
    console.log('Device online packet received.');

    // 发送上线响应包
    const response = Buffer.from([
      0xfe, 0x04, 0x03, 0xe8, 0x00, 0x01, 0xa5, 0xb5,
    ]);
    socket.write(response);
    console.log('Sent online response packet.');

    isOnline = true;
  } else {
    console.log('Invalid online packet. Closing connection.');
    socket.destroy(); // 关闭连接
  }
}

// 处理常规数据包
function handleDataPacket(socket) {
  if (buffer[0] === 0xfe && buffer[1] === 0x04 && buffer[2] === 0x02) {
    // 解析设备地址
    deviceId = buffer[4];
    if (deviceId < 0) {
      console.log('Invalid device address. Requesting address info again.');
      const response = Buffer.from([
        0xfe, 0x04, 0x03, 0xe8, 0x00, 0x01, 0xa5, 0xb5,
      ]);
      socket.write(response);
    } else {
      console.log(`Device ${deviceId} is online.`);
      sockets.set(deviceId, socket); // 记录设备连接
    }
  } else if (
    buffer[0] === deviceId &&
    buffer[1] === 0x01 &&
    buffer[2] === 0x01
  ) {
    // 处理设备开关状态
    const isSecondRouteOpen = (buffer[3] & (1 << 1)) !== 0;
    const isFirstRouteOpen = (buffer[3] & 1) !== 0;
    console.log(
      `Device ${deviceId}: First route ${isFirstRouteOpen ? 'ON' : 'OFF'}, Second route ${
        isSecondRouteOpen ? 'ON' : 'OFF'
      }`
    );
  } else {
    console.log('Received heartbeat or unknown packet.');
    // 心跳包逻辑处理
  }
}

// 启动服务器
const PORT = 12345;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
