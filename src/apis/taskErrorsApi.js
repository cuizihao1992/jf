
import request from '@/api/request';

const taskErrorsApi = {
  query(filters) {
    return request('get', '/task-errors', { params: filters });
  },

  add(data) {
    return request('post', '/task-errors', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/task-errors'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/task-errors'}/${id}`);
  },
};

export default taskErrorsApi;
