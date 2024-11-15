import { deviceService } from '@/api/fetch.js';

export const deviceServiceApi = {
  async fetchDeviceList() {
    // 模拟从 API 获取数据
    const res = await deviceService.list();
    return res;
  },
};
