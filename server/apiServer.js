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

// Provide static file access
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Helper function to send command with timeout
async function sendAndLogCommandWithTimeout(addr, command, timeout = 3000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout)
  );

  return await Promise.race([sendTCPCommand(addr, command), timeoutPromise]);
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
