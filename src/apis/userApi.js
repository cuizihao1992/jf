
import request from '@/api/request';

const userApi = {
  query(filters) {
    return request('get', '/user', { params: filters });
  },

  add(data) {
    return request('post', '/user', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/user'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/user'}/${id}`);
  },
};

export default userApi;
