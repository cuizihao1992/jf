
import request from '@/api/request';

const scheduledTasksApi = {
  query(filters) {
    return request('get', '/scheduled-tasks', { params: filters });
  },

  add(data) {
    return request('post', '/scheduled-tasks', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/scheduled-tasks'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/scheduled-tasks'}/${id}`);
  },
};

export default scheduledTasksApi;
