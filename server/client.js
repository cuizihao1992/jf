const net = require('net');

// 服务器地址和端口
const SERVER_HOST = '127.0.0.1'; // 替换为服务器地址
const SERVER_PORT = 1051;

// 心跳数据
const HEARTBEAT = Buffer.from('68430f16', 'hex');

// 请求与响应的映射
const RESPONSES = {
  '6843f10016': '6843000004ffffffff16',
  '6843f20016': '68430100100000000000000000000000000000000016',
  '6843f30016': '684302000600000000000016',
  '6843f40016': '684303001424259e3a0505050505051400461f0c2a138a319616',
  '6843f50016': '6843040006e78e8be99baa16',
  '6843f60016': '68437f0002f60016',
};

let client;
let reconnectTimeout;

// 创建客户端并尝试连接
function connectToServer() {
  client = new net.Socket();

  client.connect(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Connected to server at ${SERVER_HOST}:${SERVER_PORT}`);

    // 定时发送心跳数据
    setInterval(() => {
      console.log(`Sending heartbeat: ${HEARTBEAT.toString('hex')}`);
      client.write(HEARTBEAT);
    }, 30000); // 30 秒
  });

  // 处理接收到的数据
  client.on('data', (data) => {
    const receivedHex = data.toString('hex');
    console.log(`Received: ${receivedHex}`);

    // 查找响应数据
    if (RESPONSES[receivedHex]) {
      const response = Buffer.from(RESPONSES[receivedHex], 'hex');
      console.log(`Sending response: ${response.toString('hex')}`);
      client.write(response);
    } else {
      console.log('No predefined response for received data.');
    }
  });

  // 处理错误
  client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
    attemptReconnect();
  });

  // 处理关闭
  client.on('close', () => {
    console.log('Connection closed');
    attemptReconnect();
  });
}

// 尝试重连
function attemptReconnect() {
  if (reconnectTimeout) return; // 防止重复触发

  console.log('Attempting to reconnect in 10 seconds...');
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null; // 清除定时器标记
    connectToServer();
  }, 10000); // 10 秒
}

// 开始连接
connectToServer();
