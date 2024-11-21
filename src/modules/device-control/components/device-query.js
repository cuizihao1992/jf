import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-query.css?inline';
import { deviceService } from '@/api/fetch.js';

class DeviceQuery extends LitElement {
  static properties = {
    showActions: { type: Boolean },
    showDeviceDetails: { type: Boolean },
    devices: { type: Array },
  };

  constructor() {
    super();
    this.showActions = false;
    this.showDeviceDetails = false;
    this.devices = [];
    this.fetchDevices();
  }

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  async fetchDevices() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
      };
      const data = await deviceService.list(params);
      this.devices = data.rows;
      
      window.dispatchEvent(new CustomEvent('devices-updated', {
        detail: {
          devices: this.devices.map(device => ({
            ...device,
            id: device.id,
            deviceName: device.deviceName,
            deviceType: device.deviceType,
            region: device.region,
            lat: device.lat,
            lon: device.lon,
            deviceStatus: device.deviceStatus,
            connectionStatus: device.connectionStatus,
            powerStatus: device.powerStatus
          }))
        }
      }));
    } catch (error) {
      console.error('获取设备信息失败:', error);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchDevices();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询方式:</label>
            <select id="search-type" style="background-color: gray;">
              <option>任务编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              style="background-color: white; "
            />
          </div>
          <button class="query-button" @click="${this.fetchDevices}">
            查询
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">设备状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>关机</option>
            </select>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>设备编号</th>
                <th>设备时间</th>
                <th>设备类型</th>
                <th>所属地区</th>
                <th>连接状态</th>
                <th>电源状态</th>
                <th>设备状态</th>
                ${this.showActions
                  ? html`<th>操作</th>`
                  : html`<th>设备详情</th>`}
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>

        ${this.showDeviceDetails ? html`<device-details></device-details>` : ''}
      </div>
    `;
  }

  renderRows() {
    return this.devices.map(
      (device) => html`
        <tr class="table-row">
          <td>${device.id}</td>
          <td>${device.syncedDeviceTime || '-'}</td>
          <td>${device.deviceType}</td>
          <td>${device.region}</td>
          <td>${device.connectionStatus}</td>
          <td>${device.powerStatus}</td>
          <td>${device.deviceStatus}</td>
          ${this.showActions
            ? html`
                <td>
                  <a class="action-button" @click="${() => this.adjustPosture(device)}">姿态调整</a>
                  <span class="button-separator">|</span>
                  <a class="action-button" @click="${() => this.locateDevice(device)}">定位</a>
                </td>
              `
            : html`
                <td>
                  <a class="action-button" @click="${this.toggleDeviceDetails}">
                    ${this.showDeviceDetails ? '关闭详情' : '查看详情'}
                  </a>
                </td>
              `}
        </tr>
      `
    );
  }

  toggleDeviceDetails() {
    this.showDeviceDetails = !this.showDeviceDetails;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
    const postureAdjustElement = document.querySelector('posture-adjust');
    if (postureAdjustElement) {
      postureAdjustElement.dispatchEvent(new CustomEvent('close-modal'));
    }
  }

  adjustPosture(device) {
    this.dispatchEvent(new CustomEvent('open-posture-adjust'));
  }

  locateDevice(device) {
    // 打印完整的设备信息以检查坐标
    console.log('设备定位信息:', {
      完整设备信息: device,
      坐标信息: {
        lat: device.lat,
        lon: device.lon,
        lat类型: typeof device.lat,
        lon类型: typeof device.lon
      }
    });

    // 验证坐标
    if (!device.lat || !device.lon) {
      console.warn('设备缺少坐标信息:', device);
      return;
    }

    // 确保发送数值类型的坐标
    const locationEvent = new CustomEvent('locate-device', {
      detail: {
        deviceId: device.id,
        deviceName: device.deviceName,
        lat: parseFloat(device.lat),
        lon: parseFloat(device.lon)
      }
    });

    console.log('发送定位事件:', locationEvent.detail);
    window.dispatchEvent(locationEvent);
  }
}

customElements.define('device-query', DeviceQuery);
