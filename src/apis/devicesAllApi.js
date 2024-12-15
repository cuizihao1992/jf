
import request from '@/api/request';

const devicesAllApi = {
  query(filters) {
    return request('get', '/devices-all', { params: filters });
  },

  add(data) {
    return request('post', '/devices-all', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/devices-all'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/devices-all'}/${id}`);
  },
};

export default devicesAllApi;
