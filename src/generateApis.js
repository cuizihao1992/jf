import fs from 'fs';
import path from 'path';

// 模块列表
const modules = {
  '/device-logs': 'deviceLogs',
  '/device-tasks': 'deviceTasks',
  '/device-types': 'deviceTypes',
  '/devices': 'devices',
  '/regions': 'regions',
  '/scheduled-tasks': 'scheduledTasks',
  '/device-reviews': 'deviceReviews',
  '/device-status-history': 'deviceStatusHistory',
  '/tasks': 'tasks',
  '/task-errors': 'taskErrors',
  '/user-review': 'userReview',
  '/user': 'user',
};

// API 模板
const apiTemplate = (moduleName, endpoint) => `
import request from '@/api/request';

const ${moduleName}Api = {
  query(filters) {
    return request('get', '${endpoint}', { params: filters });
  },

  add(data) {
    return request('post', '${endpoint}', { data });
  },

  update(id, updatedData) {
    return request('put', \`\${'${endpoint}'}/\${id}\`, { data: updatedData });
  },

  delete(id) {
    return request('delete', \`\${'${endpoint}'}/\${id}\`);
  },
};

export default ${moduleName}Api;
`;

// 动态生成 API 文件
Object.entries(modules).forEach(([endpoint, moduleName]) => {
  const fileName = `${moduleName}Api.js`;
  const filePath = path.resolve('./apis', fileName);

  const content = apiTemplate(moduleName, endpoint);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`API 文件生成成功: ${fileName}`);
});

console.log('所有 API 文件已生成！');
