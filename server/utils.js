const db = require('./db');

// 保存设备状态到数据库
async function saveDeviceStatus(clientInfo, data) {
  const [ip, port] = clientInfo.split(':');
  await db('jf_device_status_history').insert({
    device_id: 1, // 示例设备ID，可动态解析
    connection_status: 'online',
    timestamp: new Date(),
  });
}

// 记录命令日志
async function logCommand(deviceId, command, response) {
  await db('jf_device_logs').insert({
    device_id: deviceId,
    event_type: 'command',
    event_description: `Command sent: ${command.toString('hex')}`,
    raw_data: response ? response.toString('hex') : null,
    timestamp: new Date(),
  });
}

module.exports = { saveDeviceStatus, logCommand };
