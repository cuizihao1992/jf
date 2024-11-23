const fs = require('fs');
const path = require('path');

// 日志文件路径
const logFilePath = path.resolve(__dirname, '../logs/server.log');

// 日志中间件
function loggerMiddleware(req, res, next) {
  const startTime = Date.now(); // 请求开始时间

  // 获取请求信息
  const { method, url, body } = req;

  // 等响应结束后记录日志
  res.on('finish', () => {
    const duration = Date.now() - startTime; // 计算请求耗时
    const logMessage = `
      ${new Date().toISOString()} | ${method} ${url} | Status: ${res.statusCode} | Duration: ${duration}ms
      Request Body: ${JSON.stringify(body)}
    `;

    console.log(logMessage); // 输出到控制台

    // 追加日志到文件
    fs.appendFile(logFilePath, logMessage + '\n', (err) => {
      if (err) {
        console.error('Failed to write log to file:', err);
      }
    });
  });

  next(); // 继续执行后续中间件
}

module.exports = loggerMiddleware;
