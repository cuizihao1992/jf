
import request from '@/api/request';

const deviceTasksApi = {
  query(filters) {
    return request('get', '/device-tasks', { params: filters });
  },

  add(data) {
    return request('post', '/device-tasks', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/device-tasks'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/device-tasks'}/${id}`);
  },
};

export default deviceTasksApi;
