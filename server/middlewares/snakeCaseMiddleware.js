const _ = require('lodash');

// 将请求参数或请求体的键从 camelCase 转换为 snake_case
function snakeCaseMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = convertKeysToSnakeCase(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = convertKeysToSnakeCase(req.query);
  }
  next();
}

// 工具函数：递归地将对象的键转换为 snake_case
function convertKeysToSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToSnakeCase(item));
  } else if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const snakeKey = _.snakeCase(key); // 使用 lodash 的 snakeCase
      acc[snakeKey] = convertKeysToSnakeCase(value); // 递归处理嵌套对象
      return acc;
    }, {});
  }
  return obj; // 非对象或数组，直接返回原值
}

module.exports = snakeCaseMiddleware;
