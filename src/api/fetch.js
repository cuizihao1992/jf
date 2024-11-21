// api.js
import { getToken } from '../components/auth';
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

    const token = localStorage.getItem('token');
    
    const options = {
      method,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': token // token 已经包含 "Bearer" 前缀
      },
      mode: 'cors',
      credentials: 'include'
    };

    // 如果不是 GET 请求并且有请求体，则添加请求体
    if (method !== 'GET' && params) {
      options.body = JSON.stringify(params);
    }

    return fetch(url, options)
      .then(async response => {
        const data = await response.json();
        if (data.code === 401) {
          // 如果返回 401，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('认证失败');
        }
        return data;
      })
      .catch((error) => {
        console.error(`请求 ${method} ${endpoint} 时出错:`, error);
        throw error;
      });
  }

  // 获取列表（list）
  list(params = { pageNum: 1, pageSize: 10000 }) {
    return this.fetchData(`${this.resource}/list`, 'GET', params);
  }

  get(id) {
    return this.fetchData(`${this.resource}/${id}`, 'GET');
  }
  // 添加数据（add）
  add(data) {
    return this.fetchData(this.resource, 'POST', data);
  }

  // 更新数据（update）
  update(data) {
    return this.fetchData(`${this.resource}`, 'PUT', data);
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
const deviceLogsService = new ApiService('logs');
const deviceReviewService = new ApiService('reviews');
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
  deviceLogsService,
  deviceReviewService,
};
