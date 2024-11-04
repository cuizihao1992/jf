// api.js

const baseUrl = 'http://fk3510tn3811.vicp.fun/jf-prod-api/system';

class ApiService {
  constructor(resource) {
    this.resource = resource;
  }

  // 通用的 fetch 请求函数
  fetchData(endpoint, method = 'GET', params = null) {
    // 如果是 GET 请求并有参数，转换为查询字符串
    const url =
      method === 'GET' && params
        ? `${baseUrl}/${endpoint}?${new URLSearchParams(params).toString()}`
        : `${baseUrl}/${endpoint}`;

    const options = {
      method,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjUzZmFkZjNmLWI1YmQtNDMwYS1hMjdlLTE5NzY0ZGI0MDA0YSJ9.2_gQANH3CK1626_swTozabfK-la4bJYL9_dRziirCjUrQdek39L7BGyvz-ec0nBaILbJW88rSuE1P2T1-na01g',
        Cookie:
          'Admin-Token=eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImY2NjEzMDI1LTU1ZDMtNGI3NC04NTk5LTMyNWUxMTc5NGY4MCJ9.PzmxmwNupLnfzArzk1DU7jv-9NnwMJwE3OTQwwu4tniVHGhuK6o88EOXlKSNGukXHivdbM0T43LuzozdzQppUA',
      },
    };

    // 如果不是 GET 请求并且有请求体，则添加请求体
    if (method !== 'GET' && params) {
      options.body = JSON.stringify(params);
    }

    return fetch(url, options)
      .then((response) => response.json())
      .catch((error) => {
        console.error(`请求 ${method} ${endpoint} 时出错:`, error);
        throw error;
      });
  }

  // 获取列表（list）
  list(params = { pageNum: 1, pageSize: 10 }) {
    return this.fetchData(`${this.resource}/list`, 'GET', params);
  }

  // 添加数据（add）
  add(data) {
    return this.fetchData(this.resource, 'POST', data);
  }

  // 更新数据（update）
  update(id, data) {
    return this.fetchData(`${this.resource}/${id}`, 'PUT', data);
  }

  // 删除数据（delete）
  delete(id) {
    return this.fetchData(`${this.resource}/${id}`, 'DELETE');
  }
}

// 使用实例
const taskService = new ApiService('tasks');
const errorService = new ApiService('errors');
const scheduledTaskService = new ApiService('scheduledTasks');
const regionService = new ApiService('regions');
const deviceService = new ApiService('devices');
const deviceTypeService = new ApiService('types');
const deviceTaskService = new ApiService('deviceTask');
const statusHistoryService = new ApiService('history');
const reviewService = new ApiService('reviews');
const logService = new ApiService('logs');

// 导出实例
export {
  taskService,
  errorService,
  scheduledTaskService,
  regionService,
  deviceService,
  deviceTypeService,
  deviceTaskService,
  statusHistoryService,
  reviewService,
  logService,
};
