import request from '@/api/request';

const api = {
  // 查询设备
  queryDevices(filters) {
    return request('get', '/devices', { params: filters });
  },

  // 添加设备
  addDevice(data) {
    return request('post', '/devices', { data });
  },

  // 更新设备
  updateDevice(deviceId, updatedData) {
    return request('put', `/devices/${deviceId}`, { data: updatedData });
  },

  // 删除设备
  deleteDevice(deviceId) {
    return request('delete', `/devices/${deviceId}`);
  },

  // 查询任务
  queryTask(filters) {
    return request('get', '/tasks', { params: filters });
  },

  // 更新任务
  updateTask(taskId, taskData) {
    return request('put', `/tasks/${taskId}`, { data: taskData });
  },
};

export default api;
