import instance from '@/api/api';
const api = {
  // 动态查询用户
  async queryDevices(filters) {
    try {
      const response = await instance.get('/devices', {
        params: filters,
      });
      return response; // 返回查询结果
    } catch (error) {
      console.error('Error querying devices:', error);
      throw error;
    }
  },
};
export default api;
