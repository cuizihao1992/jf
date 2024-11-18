const db = require('./db');

// 保存设备状态到数据库
async function saveDeviceStatus(clientInfo, data) {
  const [ip, port] = clientInfo.split(':');
  await db('jf_device_status_history').insert({
    device_id: 1, // 示例设备ID，可动态解析
    connection_status: 'online',
    device_status: 'on', // 示例状态，可动态解析
    power_status: 'normal', // 示例电源状态
    timestamp: new Date(),
  });
}

// 记录命令日志
async function logCommand(deviceId, command, response, taskNumber = null) {
  await db('jf_device_logs').insert({
    device_id: deviceId,
    task_number: taskNumber,
    event_type: 'command',
    event_description: `Command sent: ${command.toString('hex')}`,
    raw_data: response ? response.toString('hex') : null,
    timestamp: new Date(),
    is_success: response ? 1 : 0, // 示例：假设有响应表示成功
  });
}

// 保存任务记录到数据库
async function saveTask(
  deviceId,
  taskId,
  userId,
  targetAzimuth,
  targetElevation,
  adjustmentAzimuth,
  adjustmentElevation,
  startTime
) {
  await db('jf_device_task').insert({
    task_id: taskId,
    user_id: userId,
    device_id: deviceId,
    target_azimuth: targetAzimuth,
    target_elevation: targetElevation,
    adjustment_azimuth: adjustmentAzimuth,
    adjustment_elevation: adjustmentElevation,
    start_time: startTime,
    is_success: 1, // 默认任务成功，可动态更新
  });
}

// 拼接命令
function createCommand(addr, commandCode, data = []) {
  return Buffer.from([0x68, addr, ...commandCode, ...data, 0x16]);
}

// 定义具体方法
function queryPanTiltAngle(addr) {
  return createCommand(addr, [0xf1, 0x00]);
}

function queryGPS(addr) {
  return createCommand(addr, [0xf2, 0x00]);
}

function queryPowerModule(addr) {
  return createCommand(addr, [0xf3, 0x00]);
}

function queryHistory(addr) {
  return createCommand(addr, [0xf4, 0x00]);
}

function queryLogs(addr) {
  return createCommand(addr, [0xf5, 0x00]);
}

function queryImages(addr) {
  return createCommand(addr, [0xf6, 0x00]);
}

function powerOn(addr) {
  return createCommand(addr, [0x0f, 0x00, 0x00, 0x04, 0x01, 0xff]);
}

function powerOff(addr) {
  return createCommand(addr, [0x0f, 0x00, 0x00, 0x04, 0x01, 0x00]);
}

function adjustHorizontalAngle(addr, angle) {
  const angleBuffer = Buffer.alloc(2); // 模拟角度转换
  return createCommand(addr, [0xf7, 0x04, 0x00, 0x4b, ...angleBuffer]);
}

function adjustVerticalAngle(addr, angle) {
  const angleBuffer = Buffer.alloc(2); // 模拟角度转换
  return createCommand(addr, [0xf7, 0x04, 0x00, 0x4d, ...angleBuffer]);
}

function syncTime(addr, time) {
  const timeBuffer = Buffer.alloc(8); // 模拟时间转换
  return createCommand(addr, [0xf8, 0x08, ...timeBuffer]);
}

module.exports = {
  saveDeviceStatus,
  logCommand,
  saveTask,
  createCommand,
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
};
