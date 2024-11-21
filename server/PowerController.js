const net = require('net');

class PowerController {
  constructor(connection) {
    if (!connection || !(connection instanceof net.Socket)) {
      throw new Error('Invalid TCP connection provided.');
    }
    this.connection = connection;

    // 请求队列，用于保存发送的命令和对应的回调
    this.requestQueue = [];

    // 监听返回数据
    this.connection.on('data', (data) => {
      this.handleResponse(data);
    });
  }

  // Helper function to send a command
  sendCommand(command) {
    return new Promise((resolve, reject) => {
      console.log('Send Command:', command);

      // 将当前请求放入队列
      this.requestQueue.push({ command, resolve, reject });

      // 发送命令
      this.connection.write(command, 'hex', (err) => {
        if (err) {
          // 如果发送失败，从队列中移除并触发拒绝
          this.requestQueue.pop(); // 移除最后一个未处理的请求
          return reject(err);
        }
      });
    });
  }

  // 处理返回数据
  handleResponse(data) {
    console.log('Received Data:', data.toString('hex'));

    // 从队列中取出第一个请求（队列遵循 FIFO 原则）
    const request = this.requestQueue.shift();
    if (!request) {
      console.error('Unexpected response, no matching request in the queue.');
      return;
    }

    // 假设返回值正确，可以直接解析；如果返回值有校验逻辑，可以在这里处理
    const { resolve } = request;
    resolve(data.toString('hex')); // 返回十六进制字符串
  }

  // Channel-specific commands
  async turnOnChannel(channel) {
    const commands = {
      1: '01050000FF008C3A',
      2: '01050001FF00DDFB',
      3: '01050002FF002DFA',
      4: '01050003FF007C3A',
    };
    const command = commands[channel];
    if (!command) {
      throw new Error(`Invalid channel: ${channel}`);
    }
    const response = await this.sendCommand(command);
    console.log(`Response for turning on channel ${channel}:`, response);
    return response;
  }

  async turnOffChannel(channel) {
    const commands = {
      1: '010500000000CDCA',
      2: '0105000100009C0A',
      3: '0105000200006C0A',
      4: '0105000300003DCA',
    };
    const command = commands[channel];
    if (!command) {
      throw new Error(`Invalid channel: ${channel}`);
    }
    const response = await this.sendCommand(command);
    console.log(`Response for turning off channel ${channel}:`, response);
    return response;
  }

  // Turn all channels on or off
  async turnAllOn() {
    const command = '010F0000000401FF7ED6';
    const response = await this.sendCommand(command);
    console.log('Response for turning all channels on:', response);
    return response;
  }

  async turnAllOff() {
    const command = '010F0000000401003E96';
    const response = await this.sendCommand(command);
    console.log('Response for turning all channels off:', response);
    return response;
  }
}

module.exports = PowerController;

// Example usage
// const connection = net.connect({ host: '192.168.1.100', port: 502 }, () => {
//   const controller = new PowerController(connection);
//   controller
//     .turnOnChannel(1)
//     .then(() => console.log('Channel 1 turned on'))
//     .catch(console.error);
// });

// Initialize power controller
let powerController;
app.get('/poweron/:id', async (req, res) => {
  if (!powerController) {
    if (clients.size > 0) {
      const client = clients.entries().next().value[1];
      powerController = new PowerController(client);
    }
  }
  if (powerController) {
    const id = req.params.id;
    try {
      const result = await powerController.turnOnChannel(id);
      const message = `Channel ${id} turned on: ${result}`;
      console.log(message);
      res.json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to turn on power', error: error.message });
    }
  }
});

// Power off endpoint
app.get('/poweroff/:id', async (req, res) => {
  if (clients.size > 0) {
    const client = clients.entries().next().value[1];
    const powerController = new PowerController(client);
    const id = req.params.id;
    try {
      await powerController.turnOffChannel(id);
      const message = `Channel ${id} turned off`;
      console.log(message);
      res.json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to turn off power', error: error.message });
    }
  }
});
