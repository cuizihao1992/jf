import request from '@/api/request';

const devicesApi = {
  getTree(filters) {
    return request('get', '/devices/tree', { params: filters });
  },
  query(filters) {
    return request('get', '/devices', { params: filters });
  },

  add(data) {
    return request('post', '/devices', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/devices'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/devices'}/${id}`);
  },
};

export default devicesApi;
