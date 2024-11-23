
import request from '@/api/request';

const tasksApi = {
  query(filters) {
    return request('get', '/tasks', { params: filters });
  },

  add(data) {
    return request('post', '/tasks', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/tasks'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/tasks'}/${id}`);
  },
};

export default tasksApi;
