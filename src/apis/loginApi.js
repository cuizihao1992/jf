import request from '@/api/request';

const loginApi = {
  login(data) {
    return request('post', '/auth/login', { data });
  },

  logout(data) {
    return request('post', '/auth/logout', { data });
  },
};

export default loginApi;
