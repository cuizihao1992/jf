const net = require('net');
const SERVER_HOST = '127.0.0.1'; // 服务器地址
const SERVER_PORT = 1050; // 服务器端口
// 模拟客户端
function startTCPClient(host, port) {
  const client = new net.Socket();

  client.connect(port, host, () => {
    console.log(`Connected to server at ${host}:${port}`);

    // 定时发送心跳数据
    setInterval(() => {
      const heartbeat = Buffer.from([0x68, 0x00, 0xff, 0x16]); // 示例心跳包
      client.write(heartbeat);
      console.log('Heartbeat sent:', heartbeat);
    }, 5000); // 每5秒发送一次心跳
  });

  client.on('data', (data) => {
    console.log('Command received from server:', data);

    // 提取请求ID（假设前4字节是请求ID）
    const requestId = data.slice(0, 4);
    const command = data.slice(4);

    // 模拟响应
    let response;
    if (command[0] === 0xf1) {
      response = Buffer.from([0x68, ...requestId, 0xf1, 0x01, 0x16]); // 云台角度响应
    } else if (command[0] === 0xf2) {
      response = Buffer.from([0x68, ...requestId, 0xf2, 0x02, 0x16]); // GPS信息响应
    } else if (command[0] === 0xf3) {
      response = Buffer.from([0x68, ...requestId, 0xf3, 0x03, 0x16]); // 电源模块响应
    } else {
      response = Buffer.from([0x68, ...requestId, 0xff, 0x00, 0x16]); // 未知命令响应
    }

    // 发送响应数据
    client.write(response);
    console.log('Response sent:', response);
  });

  client.on('close', () => {
    console.log('Connection closed');
  });

  client.on('error', (err) => {
    console.error('Error:', err.message);
  });
}

// 启动客户端
startTCPClient(SERVER_HOST, SERVER_PORT);
