
import request from '@/api/request';

const deviceStatusHistoryApi = {
  query(filters) {
    return request('get', '/device-status-history', { params: filters });
  },

  add(data) {
    return request('post', '/device-status-history', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/device-status-history'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/device-status-history'}/${id}`);
  },
};

export default deviceStatusHistoryApi;
