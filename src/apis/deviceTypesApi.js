
import request from '@/api/request';

const deviceTypesApi = {
  query(filters) {
    return request('get', '/device-types', { params: filters });
  },

  add(data) {
    return request('post', '/device-types', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/device-types'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/device-types'}/${id}`);
  },
};

export default deviceTypesApi;
