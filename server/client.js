const net = require('net');

// 配置服务器信息
const SERVER_HOST = '127.0.0.1'; // 服务器地址
const SERVER_PORT = 1050; // 服务器端口

// 模拟设备 ID 和心跳包数据
const DEVICE_ID = 1;
const HEARTBEAT_INTERVAL = 5000; // 心跳包间隔（毫秒）

// 创建 TCP 客户端
const client = new net.Socket();

// 连接到服务器
client.connect(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Connected to server at ${SERVER_HOST}:${SERVER_PORT}`);

  // 发送注册信息
  const registerMessage = Buffer.from([DEVICE_ID, 0x01]); // 注册命令
  client.write(registerMessage);
  console.log(`Sent register message: ${registerMessage.toString('hex')}`);
});

// 监听服务器命令
client.on('data', (data) => {
  console.log(`Received from server: ${data.toString('hex')}`);
  handleCommand(data);
});

// 模拟发送心跳包
setInterval(() => {
  const heartbeatMessage = Buffer.from([DEVICE_ID, 0x02]); // 心跳包
  client.write(heartbeatMessage);
  console.log(`Sent heartbeat: ${heartbeatMessage.toString('hex')}`);
}, HEARTBEAT_INTERVAL);

// 处理收到的命令
function handleCommand(data) {
  const commandType = data[1]; // 根据协议获取命令类型
  let response;

  switch (commandType) {
    case 0xf1: // 查询角度
      const angle = getSimulatedAngle(); // 模拟获取角度
      response = Buffer.from([
        DEVICE_ID,
        0xf1,
        angle.azimuth,
        angle.elevation,
        0x16,
      ]);
      console.log(
        `Responding with angle: Azimuth=${angle.azimuth}, Elevation=${angle.elevation}`
      );
      break;

    case 0xf2: // 查询GPS信息
      const gps = getSimulatedGPS(); // 模拟获取GPS信息
      response = Buffer.from([DEVICE_ID, 0xf2, gps.lat, gps.lon, 0x16]);
      console.log(
        `Responding with GPS: Latitude=${gps.lat}, Longitude=${gps.lon}`
      );
      break;

    case 0xf3: // 查询电源模块信息
      const powerInfo = getSimulatedPowerInfo(); // 模拟电源信息
      response = Buffer.from([
        DEVICE_ID,
        0xf3,
        powerInfo.voltage,
        powerInfo.level,
        0x16,
      ]);
      console.log(
        `Responding with Power Info: Voltage=${powerInfo.voltage}, Level=${powerInfo.level}`
      );
      break;

    case 0xf4: // 查询历史数据
      response = getSimulatedHistoryData(); // 模拟历史数据
      console.log('Responding with historical data');
      break;

    case 0xf5: // 查询日志
      response = getSimulatedLogs(); // 模拟日志
      console.log('Responding with logs');
      break;

    case 0xf6: // 查询图像
      response = getSimulatedImage(); // 模拟图像数据
      console.log('Responding with image data');
      break;

    default:
      console.log(`Unknown command received: ${commandType.toString(16)}`);
      response = Buffer.from([DEVICE_ID, 0xff, 0x00, 0x16]); // 未知命令响应
      break;
  }

  if (response) {
    client.write(response);
    console.log(`Sent response: ${response.toString('hex')}`);
  }
}

// 模拟获取角度
function getSimulatedAngle() {
  return { azimuth: 45, elevation: 30 }; // 示例数据
}

// 模拟获取GPS信息
function getSimulatedGPS() {
  return { lat: 35.6895, lon: 139.6917 }; // 示例东京坐标
}

// 模拟获取电源信息
function getSimulatedPowerInfo() {
  return { voltage: 220, level: 80 }; // 示例电源电压和电量百分比
}

// 模拟历史数据
function getSimulatedHistoryData() {
  return Buffer.from([DEVICE_ID, 0xf4, 0x01, 0x02, 0x03, 0x16]); // 示例历史数据
}

// 模拟日志
function getSimulatedLogs() {
  return Buffer.from([DEVICE_ID, 0xf5, 0x0a, 0x0b, 0x0c, 0x16]); // 示例日志数据
}

// 模拟图像数据
function getSimulatedImage() {
  return Buffer.from([DEVICE_ID, 0xf6, 0x11, 0x12, 0x13, 0x16]); // 示例图像数据
}

// 处理连接关闭
client.on('close', () => {
  console.log('Connection closed');
});

// 处理错误
client.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
