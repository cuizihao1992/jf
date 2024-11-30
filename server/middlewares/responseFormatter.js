const moment = require('moment');
const _ = require('lodash');

// 格式化响应数据中的时间字段并转换字段为驼峰命名
function formatResponse(data) {
  if (Array.isArray(data)) {
    // 如果是数组，对每个元素递归处理
    return data.map((item) => formatResponse(item));
  } else if (typeof data === 'object' && data !== null) {
    // 如果是对象，递归处理
    return formatObject(data);
  }
  return data;
}

// 格式化单个对象中的字段，包括嵌套对象
function formatObject(obj) {
  const keysToFormat = [
    'created_time',
    'start_time',
    'end_time',
    'install_time',
    'send_time',
    'completion_time',
  ]; // 需要格式化为日期的字段

  // 创建一个新对象，递归处理键值对
  const formattedObj = Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = _.camelCase(key); // 转为驼峰命名

    if (keysToFormat.includes(key) && value) {
      // 格式化时间字段
      acc[camelKey] = moment(value).format('YYYY-MM-DD HH:mm:ss');
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象或数组
      acc[camelKey] = formatResponse(value);
    } else {
      // 保留原值
      acc[camelKey] = value;
    }

    return acc;
  }, {});

  return formattedObj;
}

// 中间件函数
function responseFormatter(req, res, next) {
  const originalJson = res.json;

  res.json = function (body) {
    if (typeof body === 'object') {
      body = formatResponse(body); // 格式化响应数据，包括嵌套对象
    }
    originalJson.call(this, body);
  };

  next();
}

module.exports = responseFormatter;
