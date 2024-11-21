const { timeStringToBytes } = require('./processData2');

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

function syncTime(addr) {
  const timestamp = new Date();
  const timeBytes = timeStringToBytes(timestamp.toISOString());
  return createCommand(addr, [0xf8, 0x08, ...timeBytes]);
}

module.exports = {
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
