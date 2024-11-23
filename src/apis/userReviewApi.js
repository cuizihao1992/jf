
import request from '@/api/request';

const userReviewApi = {
  query(filters) {
    return request('get', '/user-review', { params: filters });
  },

  add(data) {
    return request('post', '/user-review', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/user-review'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/user-review'}/${id}`);
  },
};

export default userReviewApi;
