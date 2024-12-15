const express = require('express');
const path = require('path');
const {
  queryPanTiltAngle,
  queryGPS,
  queryPowerModule,
  queryHistory,
  queryLogs,
  queryImages,
  powerOn,
  powerOff,
  adjustHorizontalAngle,
  adjustVerticalAngle,
  syncTime,
} = require('./utils');
const { sendTCPCommand } = require('./processData.js');
const commandLogs = require('./modules/commandLogs');

// Provide static file access
const app = express();
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, '../dist')));
app.use(express.json());

// Helper function to send command with timeout
async function sendAndLogCommandWithTimeout(addr, command, timeout = 3000) {
  const createTime = new Date(); // 当前时间
  let logId;

  try {
    // 插入初始日志记录，状态为 "pending"
    logId = await commandLogs.add({
      addr,
      command: command.toString('hex'),
      type: 'control', // 可根据业务需要调整
      value: null,
      success: null, // 初始状态不设置成功与否
      result: null,
      result_value: null,
      status: 'pending',
      image: null,
      send_time: createTime,
      receive_time: null, // 初始状态没有接收时间
      create_time: createTime,
    });

    // 超时逻辑
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    );

    // 发送命令，返回结果或超时
    const result = await Promise.race([
      sendTCPCommand(addr, command),
      timeoutPromise,
    ]);

    // 如果成功接收数据，更新状态
    const receiveTime = new Date(); // 接收时间
    await commandLogs.update(logId, {
      success: 'true',
      result: result,
      status: 'completed',
      receive_time: receiveTime,
    });

    return result; // 返回命令执行结果
  } catch (error) {
    // 如果超时或失败，更新状态为失败
    const receiveTime = new Date(); // 接收时间
    await commandLogs.update(logId, {
      success: 'false',
      result: error.message,
      status: 'failed',
      receive_time: receiveTime,
    });

    throw error; // 重新抛出错误以供上层捕获
  }
}

// API endpoints with timeout
app.get('/devices/:id/angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryPanTiltAngle(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Angle command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Angle command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/gps', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryGPS(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command, 5000);
    res.json({
      command: command.toString('hex'),
      result,
      message: `GPS command sent successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to send GPS command', error: error.message });
  }
});

app.get('/devices/:id/powermodule', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryPowerModule(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Power Module command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Power Module command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/history', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryHistory(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: `History command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send History command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/logs', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryLogs(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Logs command sent successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to send Logs command', error: error.message });
  }
});

app.get('/devices/:id/images', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = queryImages(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command, 10000);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Images command sent successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to send Images command', error: error.message });
  }
});

app.get('/devices/:id/power-on', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = powerOn(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command, 0);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Power-On command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Power-On command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/power-off', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = powerOff(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command, 0);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Power-Off command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Power-Off command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/horizontal-angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const { angle } = req.body;
    const command = adjustHorizontalAngle(addr, angle);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: 'Horizontal angle adjustment command sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Horizontal angle adjustment command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/vertical-angle', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const { angle } = req.body;
    const command = adjustVerticalAngle(addr, angle);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: 'Vertical angle adjustment command sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Vertical angle adjustment command',
      error: error.message,
    });
  }
});

app.get('/devices/:id/sync-time', async (req, res) => {
  try {
    const addr = parseInt(req.params.id, 10);
    const command = syncTime(addr);
    const result = await sendAndLogCommandWithTimeout(addr, command);
    res.json({
      command: command.toString('hex'),
      result,
      message: `Time synchronization command sent successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send Time synchronization command',
      error: error.message,
    });
  }
});

module.exports = app;
