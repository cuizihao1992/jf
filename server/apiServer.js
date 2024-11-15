const express = require('express');
const db = require('./db');
const { clients } = require('./tcpServer');
const { logCommand } = require('./utils');

const app = express();
app.use(express.json());

// 查询设备状态
app.get('/devices', async (req, res) => {
  const devices = await db('jf_devices').select('*');
  res.json(devices);
});

// 发送命令
app.post('/devices/:id/command', async (req, res) => {
  const deviceId = req.params.id;
  const command = Buffer.from(req.body.command, 'hex');
  const client = clients.get(`127.0.0.1:${deviceId}`); // 示例映射

  if (!client) {
    return res.status(404).json({ message: 'Device not connected' });
  }

  client.write(command, async () => {
    console.log(`Command sent to device ${deviceId}:`, command);
    await logCommand(deviceId, command);
    res.json({ message: 'Command sent successfully' });
  });
});

// 查询日志
app.get('/logs', async (req, res) => {
  const logs = await db('jf_device_logs').select('*');
  res.json(logs);
});

module.exports = app;
