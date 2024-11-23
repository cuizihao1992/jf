
import request from '@/api/request';

const regionsApi = {
  query(filters) {
    return request('get', '/regions', { params: filters });
  },

  add(data) {
    return request('post', '/regions', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/regions'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/regions'}/${id}`);
  },
};

export default regionsApi;
