
import request from '@/api/request';

const deviceReviewsApi = {
  query(filters) {
    return request('get', '/device-reviews', { params: filters });
  },

  add(data) {
    return request('post', '/device-reviews', { data });
  },

  update(id, updatedData) {
    return request('put', `${'/device-reviews'}/${id}`, { data: updatedData });
  },

  delete(id) {
    return request('delete', `${'/device-reviews'}/${id}`);
  },
};

export default deviceReviewsApi;
