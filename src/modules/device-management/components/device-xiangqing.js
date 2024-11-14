import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-xiangqing.css?inline';
import { deviceService } from '@/api/fetch.js';

class Devicexiangqing extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
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
        <div class="button-group" style="margin-top: 15px;">
          <button class="action-button" @click="${this.submit}">提交</button>
          <button class="action-button" @click="${this.cancel}">取消</button>
        </div>
      </div>
    `;
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  submit() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  cancel() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-xiangqing', Devicexiangqing);
