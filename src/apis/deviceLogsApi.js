
import request from '@/api/request';

const deviceLogsApi = {
  query(filters) {
    return request('get', '/device-logs', { params: filters });
  },

  add(data) {
    return request('post', '/device-logs', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/device-logs'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/device-logs'}/${id}`);
  },
};

export default deviceLogsApi;
