import { LitElement, html, css } from 'lit';
import { deviceService } from '@/api/fetch.js'; // 引入设备服务

class DeviceParticulars extends LitElement {
  static styles = css`
    .modal {
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 425px;
      height: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
    }

    .header {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
    }

    .form-group label {
      margin-right: 10px;
      white-space: nowrap;
    }

    .form-group select,
    .form-group input {
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
      flex-grow: 1;
    }

    .button-group {
      display: flex;
      justify-content: space-around;
      width: 100%;
    }

    .action-button {
      padding: 10px 20px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      width: 150px;
      text-align: center;
    }
    .task-info {
      grid-column: 1; /* 占第一列 */
      display: grid;
      gap: 5px; /* 间距 */
      border: 1px solid #58a6ff;
      padding: 10px; /* 内边距 */
      border-radius: 5px;
      background-color: rgba(20, 30, 50, 0.8); /* 背景颜色 */
      width: 400px;
      height: 420px; /* 高度缩小至原来的三分之二 */
    }
    .task-info h2 {
      margin: 0;
      padding-bottom: 1px; /* 内边距 */
      text-align: left;
      font-size: 20px; /* 字体大小 */
    }
    .task-info .row {
      display: flex;
      justify-content: space-between; /* 标签和输入框分布均匀 */
      align-items: center; /* 垂直居中 */
      gap: 0px; /* 间距 */
    }
    .task-info label {
      color: white;
      width: 100px; /* 标签宽度 */
      font-size: 14px; /* 字体大小 */
    }
    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }
  `;
  static get properties() {
    return {
      devices: { type: Array },
      selectedDevice: { type: Object }, // 添加选中的设备属性
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.selectedDevice = {};
    this.fetchDevices(); // 初始化时获取设备数据
  }

  async fetchDevices() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        // 可以根据需要添加其他查询参数
      };
      const data = await deviceService.list(params);
      this.devices = data.rows;
      if (this.devices.length > 0) {
        this.selectedDevice = this.devices[0]; // 默认选择第一个设备
      }
    } catch (error) {
      console.error('获取设备数据失败:', error);
    }
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备详情
          <button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <div class="task-info">
          <h2>设备信息</h2>
          <div class="row-task">
            <label for="task-name">设备编号:</label>
            <input
              type="text"
              id="task-name"
              .value="${this.selectedDevice.id || ''}"
              readonly
            />
          </div>
          <div class="row-task-number">
            <label for="task-number">所属地区:</label>
            <input
              type="text"
              id="task-number"
              .value="${this.selectedDevice.region || ''}"
              readonly
            />
          </div>
          <div class="row-start-time">
            <label for="start-time">设备类型:</label>
            <input
              type="text"
              id="start-time"
              .value="${this.selectedDevice.deviceType || ''}"
              readonly
            />
          </div>
          <div class="row-location">
            <label for="location">偏磁角度:</label>
            <input
              id="location"
              .value="${this.selectedDevice.cpj || ''}"
              readonly
            />
          </div>
          <div class="row-end-time">
            <label for="end-time">安装方位角度:</label>
            <input
              type="text"
              id="end-time"
              .value="${this.selectedDevice.currentAzimuth || ''}"
              readonly
            />
          </div>
          <div class="row-execution-time">
            <label for="execution-time-1">安装俯仰角度:</label>
            <input
              type="text"
              id="execution-time-1"
              .value="${this.selectedDevice.currentElevation || ''}"
              readonly
            />
          </div>
          <div class="row-device-longitude">
            <label for="device-longitude">设备所在经度:</label>
            <input
              type="text"
              id="device-longitude"
              .value="${this.selectedDevice.lon || ''}"
              readonly
            />
          </div>
          <div class="row-device-latitude">
            <label for="device-latitude">设备所在纬度:</label>
            <input
              type="text"
              id="device-latitude"
              .value="${this.selectedDevice.lat || ''}"
              readonly
            />
          </div>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-particulars', DeviceParticulars);
