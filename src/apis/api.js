const modules = import.meta.glob('./*.js', { eager: true });

const apis = {};

for (const path in modules) {
  // 获取文件名作为键名，去掉路径和后缀，例如 './devicesApi.js' -> 'devicesApi'
  const moduleName = path.split('/').pop().replace('.js', '');
  apis[moduleName] = modules[path].default;
}

export default apis;
