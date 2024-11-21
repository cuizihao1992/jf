const net = require('net');
const fs = require('fs');
const path = require('path');

// 全局常量
const BUFFER_SIZE = 100; // 数据缓冲区大小
const IMAGE_BUFFER_SIZE = 100000; // 图像缓冲区大小
const sockets = new Map(); // 存储设备连接信息
let imageBuffer = Buffer.alloc(IMAGE_BUFFER_SIZE);
let imgNum = 0;

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );

  let isOnline = false;
  let deviceId = null;
  const buffer = Buffer.alloc(BUFFER_SIZE);

  // 监听数据事件
  socket.on('data', (data) => {
    data.copy(buffer);

    try {
      if (!isOnline) {
        handleOnlinePacket(socket, buffer);
      } else {
        handleDataPacket(socket, buffer);
      }

      // 清空缓冲区
      buffer.fill(0);
    } catch (err) {
      console.error(`Error processing data: ${err.message}`);
      socket.destroy();
    }
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

  // 监听超时
  socket.setTimeout(30000);
  socket.on('timeout', () => {
    console.log(`Connection timeout for device ${deviceId}`);
    socket.destroy();
  });
});

// 处理设备上线数据包
function handleOnlinePacket(socket, buffer) {
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
    socket.destroy();
  }
}

// 处理常规数据包
function handleDataPacket(socket, buffer) {
  if (buffer[0] === 0xfe && buffer[1] === 0x04 && buffer[2] === 0x02) {
    // 处理心跳包或地址数据
    deviceId = buffer[4];
    if (deviceId < 0) {
      console.log('Invalid device address. Requesting address info again.');
      const response = Buffer.from([
        0xfe, 0x04, 0x03, 0xe8, 0x00, 0x01, 0xa5, 0xb5,
      ]);
      socket.write(response);
    } else {
      console.log(`Device ${deviceId} is online.`);
      sockets.set(deviceId, socket);
    }
  } else if (
    buffer[0] === deviceId &&
    buffer[1] === 0x01 &&
    buffer[2] === 0x01
  ) {
    // 处理设备状态更新
    const isSecondRouteOpen = (buffer[3] & (1 << 1)) !== 0;
    const isFirstRouteOpen = (buffer[3] & 1) !== 0;
    console.log(
      `Device ${deviceId}: First route ${isFirstRouteOpen ? 'ON' : 'OFF'}, Second route ${
        isSecondRouteOpen ? 'ON' : 'OFF'
      }`
    );
  } else if (buffer[2] === 0x05) {
    // 图像数据包处理（可选）
    handleImageData(buffer, socket, deviceId);
  } else {
    console.log('Received unknown packet.');
  }
}

// 处理图像数据包
function handleImageData(buffer, socket, deviceId) {
  let frameLen = buffer.readUInt16LE(3); // 帧长度
  let frameNum = buffer[7] & 0x7f; // 帧号
  console.log(
    `Received frame ${frameNum} of length ${frameLen} from device ${deviceId}`
  );

  // 拼接帧数据
  imageBuffer.set(buffer.slice(8, 8 + frameLen), imgNum);
  imgNum += frameLen;

  // 如果是最后一帧
  if (buffer[7] & 0x80) {
    const imagePath = path.join(__dirname, `images/${deviceId}_image.jpg`);
    fs.writeFileSync(imagePath, imageBuffer.slice(0, imgNum));
    console.log(`Image from device ${deviceId} saved at ${imagePath}`);

    imgNum = 0; // 重置图像缓冲区索引
    imageBuffer.fill(0); // 清空图像缓冲区
  }
}

// 启动服务器
const PORT = 12345;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
