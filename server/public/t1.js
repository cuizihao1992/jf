const net = require('net');
const fs = require('fs');
const path = require('path');

const BUFFER_SIZE = 1409;
const IMAGE_BUFFER_SIZE = 100000;
const sockets = new Map(); // 存储设备的 socket 连接
let imageBuffer = Buffer.alloc(IMAGE_BUFFER_SIZE);
let imgNum = 0;

const handleTaskOperations = require('./taskOperations'); // 任务操作的独立模块（模拟任务相关逻辑）

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`New connection from ${remoteAddress}`);
  let buffer = Buffer.alloc(BUFFER_SIZE);
  let isOnline = false;
  let deviceId = null;

  socket.on('data', async (data) => {
    try {
      buffer = Buffer.from(data);

      if (!isOnline) {
        // 设备上线处理
        if (buffer[0] === 0x68 && buffer[2] === 0x0f && buffer[3] === 0x16) {
          deviceId = buffer[1];
          console.log(`Device ${deviceId} is online`);

          // 设备注册并更新状态
          sockets.set(deviceId, socket);
          await handleTaskOperations.updateDeviceStatus(deviceId, 5); // 更新为待机状态

          // 校时（发送时间信息）
          const timestamp = new Date();
          const timeBytes = timeStringToBytes(timestamp.toISOString());
          const sendBuffer = Buffer.from([
            0x68,
            deviceId,
            0xf8,
            8,
            ...timeBytes,
            0x16,
          ]);
          socket.write(sendBuffer);
          console.log('Sent time synchronization info to device.');

          isOnline = true;
        } else {
          console.log(`Invalid device connection from ${remoteAddress}`);
          socket.destroy();
        }
      } else {
        // 处理在线设备数据
        if (buffer[0] === 0x68) {
          if (buffer[2] === 0x0f && buffer[3] === 0x16) {
            // 心跳包
            console.log(`Heartbeat from device ${deviceId}`);
          } else if (buffer[2] === 0x05) {
            // 图像数据包处理
            await handleImageData(buffer, socket, deviceId);
          }
        } else if (buffer[0] === 0xfe) {
          console.log(`Device ${deviceId} is alive`);
        }
      }
    } catch (error) {
      console.error(
        `Error processing data from ${remoteAddress}:`,
        error.message
      );
      socket.destroy();
    }
  });

  socket.on('close', () => {
    console.log(`Connection closed for device ${deviceId}`);
    sockets.delete(deviceId);
  });

  socket.on('error', (err) => {
    console.error(`Error on connection from ${remoteAddress}:`, err.message);
  });
});

// 处理图像数据
async function handleImageData(buffer, socket, deviceId) {
  let frameLen = buffer.readUInt16LE(3); // 帧长
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

    // 更新任务状态
    await handleTaskOperations.updateImageTaskStatus(deviceId);
  }
}

// 时间字符串转换为字节数组（时间同步）
function timeStringToBytes(timeString) {
  const date = new Date(timeString);
  return [
    date.getFullYear() % 100, // 年后两位
    date.getMonth() + 1, // 月
    date.getDate(), // 日
    date.getHours(), // 时
    date.getMinutes(), // 分
    date.getSeconds(), // 秒
    0x00, // 占位符
    0x00, // 占位符
  ];
}

// 启动服务器
const PORT = 12345;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
