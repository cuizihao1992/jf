const express = require('express');
const db = require('./db');
const {
  queryPanTiltAngle,
  queryGPS,
  queryPowerModule,
  powerOn,
  powerOff,
  adjustHorizontalAngle,
  adjustVerticalAngle,
  syncTime,
  logCommand,
  saveTask,
  createCommand,
} = require('./utils');
const { sendTCPCommand } = require('./tcpServer');

const app = express();
app.use(express.json());

// 辅助函数：发送命令并记录日志
async function sendAndLogCommand(addr, command, taskNumber = null) {
  const clientInfo = `127.0.0.1:${addr}`; // 示例：映射设备地址
  await sendTCPCommand(clientInfo, command);
  await logCommand(addr, command, null, taskNumber);
}

// 查询云台角度
app.get('/devices/:id/pan-tilt-angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryPanTiltAngle(addr);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Pan-Tilt Angle command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Pan-Tilt Angle command', error: error.message });
  }
});

// 查询GPS信息
app.get('/devices/:id/gps', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryGPS(addr);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'GPS command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send GPS command', error: error.message });
  }
});

// 打开电源
app.post('/devices/:id/power-on', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = powerOn(addr);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Power-On command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Power-On command', error: error.message });
  }
});

// 关闭电源
app.post('/devices/:id/power-off', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = powerOff(addr);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Power-Off command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Power-Off command', error: error.message });
  }
});

// 调整水平角度
app.post('/devices/:id/horizontal-angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const { angle } = req.body;
    const command = adjustHorizontalAngle(addr, angle);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Horizontal angle adjustment command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Horizontal angle adjustment command', error: error.message });
  }
});

// 调整垂直角度
app.post('/devices/:id/vertical-angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const { angle } = req.body;
    const command = adjustVerticalAngle(addr, angle);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Vertical angle adjustment command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Vertical angle adjustment command', error: error.message });
  }
});

// 时间同步
app.post('/devices/:id/sync-time', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const { time } = req.body;
    const command = syncTime(addr, time);
    await sendAndLogCommand(addr, command);
    res.json({ message: 'Time synchronization command sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send Time synchronization command', error: error.message });
  }
});

module.exports = app;
