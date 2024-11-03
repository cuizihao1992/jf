import axios from 'axios';
import Cookies from 'js-cookie';

// 创建 axios 实例
const instance = axios.create({
  baseURL: '/api', // 你的 API 基础 URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器：为每个请求添加 token
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // 从 Cookies 获取 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 添加 token 到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：检查未登录状态并跳转登录页面
instance.interceptors.response.use(
  (response) => {
    return response.data; // 正常响应数据
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 如果返回 401 状态码，表示未登录，清除 token 并跳转到登录页面
      Cookies.remove('token'); // 清除 Cookies 中的 token
      window.location.href = '/login'; // 跳转到登录页面
    }
    return Promise.reject(error);
  }
);

// 导出 API 调用方法
export const api = {
  queryDevice: () => {
    return instance.get('/device-query'); // 设备查询
  },

  postureAdjust: () => {
    return instance.post('/posture-adjust', { posture: 'new posture data' }); // 姿态调整
  },

  // 登录 API 示例
  login: (username, password, role) => {
    return instance.post('/login', { username, password, role });
  },
};
