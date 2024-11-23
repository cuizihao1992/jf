const moment = require('moment');

// 格式化响应数据中的时间字段
function formatResponse(data) {
  if (Array.isArray(data)) {
    return data.map((item) => formatObjectTime(item));
  } else if (typeof data === 'object' && data !== null) {
    return formatObjectTime(data);
  }
  return data;
}

// 格式化单个对象中的时间字段
function formatObjectTime(obj) {
  const keysToFormat = [
    'created_time',
    'start_time',
    'end_time',
    'install_time',
  ]; // 需要格式化的字段
  const formattedObj = { ...obj };

  keysToFormat.forEach((key) => {
    if (formattedObj[key]) {
      formattedObj[key] = moment(formattedObj[key]).format(
        'YYYY-MM-DD HH:mm:ss'
      );
    }
  });

  return formattedObj;
}

// 中间件函数
function responseFormatter(req, res, next) {
  const originalJson = res.json;

  res.json = function (body) {
    if (typeof body === 'object') {
      body = formatResponse(body); // 格式化响应数据
    }
    originalJson.call(this, body);
  };

  next();
}

module.exports = responseFormatter;
