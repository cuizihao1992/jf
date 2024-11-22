const knex = require('knex');
const config = require('./config');

const db = knex({
  client: 'mysql2',
  connection: config.database,
});
// // 保存设备状态到数据库
// async function saveDeviceStatus(port, data) {
//   // const [ip, port] = clientInfo.split(':');
//   await db('jf_device_status_history').insert({
//     device_id: parseInt(port),
//     connection_status: data.toString('hex'),
//     device_status: 'on', // 示例状态，可动态解析
//     power_status: 'normal', // 示例电源状态
//     timestamp: new Date(),
//   });
// }
// // 记录命令日志
// async function logCommand(deviceId, command, response, taskNumber = null) {
//   await db('jf_device_logs').insert({
//     device_id: deviceId,
//     task_number: taskNumber,
//     event_type: 'command',
//     event_description: `Command sent: ${command.toString('hex')}`,
//     raw_data: response ? response.toString('hex') : null,
//     timestamp: new Date(),
//     is_success: response ? 1 : 0, // 示例：假设有响应表示成功
//   });
// }

// // 保存任务记录到数据库
// async function saveTask(
//   deviceId,
//   taskId,
//   userId,
//   targetAzimuth,
//   targetElevation,
//   adjustmentAzimuth,
//   adjustmentElevation,
//   startTime
// ) {
//   await db('jf_device_task').insert({
//     task_id: taskId,
//     user_id: userId,
//     device_id: deviceId,
//     target_azimuth: targetAzimuth,
//     target_elevation: targetElevation,
//     adjustment_azimuth: adjustmentAzimuth,
//     adjustment_elevation: adjustmentElevation,
//     start_time: startTime,
//     is_success: 1, // 默认任务成功，可动态更新
//   });
// }
module.exports = db;
