const fs = require('fs');
const path = require('path');
// Constants and Buffers
const BUFFER_SIZE = 307250; // 数据包的缓冲区大小
const IMAGE_BUFFER_SIZE = 307250; // 图像数据的缓冲区大小
let imageBuffer = Buffer.alloc(IMAGE_BUFFER_SIZE); // 用于存储图像数据的缓冲区
let imgNum = 0; // 图像缓冲区的当前索引

// State list to maintain device statuses
const deviceStatusList = new Map(); // 存储设备状态

// 创建 TCP 服务器
const processData2 = (socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`New connection from ${remoteAddress}`);

  let buffer = Buffer.alloc(BUFFER_SIZE);
  let isOnline = false;
  let deviceId = null;

  // 监听数据事件
  socket.on('data', async (data) => {
    try {
      buffer = Buffer.from(data); // 将数据存储到缓冲区

      if (!isOnline) {
        // 设备上线处理
        if (buffer[0] === 0x68 && buffer[2] === 0x0f && buffer[3] === 0x16) {
          deviceId = buffer[1];
          console.log(`Device ${deviceId} is online`);

          // 设备注册并更新状态
          deviceStatusList.set(deviceId, { status: '待机' }); // 更新为待机状态

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
    }
  });
};

// 处理图像数据
async function handleImageData(buffer, socket, deviceId) {
  let frameLen = buffer.readUInt16LE(3); // 帧长
  let frameNum = buffer[7] & 0x7f; // 帧号
  console.log(
    `Received frame ${frameNum} of length ${frameLen} from device ${deviceId}`
  );

  // 检查图像数据是否会导致缓冲区溢出
  if (imgNum + frameLen > IMAGE_BUFFER_SIZE) {
    console.error('Buffer overflow: image data too large');
    return;
  }

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

    // 更新设备状态
    deviceStatusList.set(deviceId, { status: '图像保存完毕' });
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
module.exports = {
  processData2,
  timeStringToBytes,
};
