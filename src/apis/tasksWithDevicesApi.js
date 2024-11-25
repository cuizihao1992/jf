
import request from '@/api/request';

const tasksWithDevicesApi = {
  query(filters) {
    return request('get', '/tasks-with-devices', { params: filters });
  },

  add(data) {
    return request('post', '/tasks-with-devices', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/tasks-with-devices'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/tasks-with-devices'}/${id}`);
  },
};

export default tasksWithDevicesApi;
