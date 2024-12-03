import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-query.css?inline';
import api from '@/apis/api';

class DeviceQuery extends LitElement {
  static properties = {
    showActions: { type: Boolean },
    showDeviceDetails: { type: Boolean },
    devices: { type: Array },
    currentTime: { type: Number },
    region: { type: String },
    deviceStatus: { type: String },
    searchType: { type: String },
    searchCondition: { type: String },
  };

  constructor() {
    super();
    this.showActions = false;
    this.showDeviceDetails = false;
    this.devices = [];
    this.currentTime = Date.now();
    this.region = '';
    this.deviceStatus = '';
    this.searchType = 'id';
    this.searchCondition = '';
    this.fetchDevices();
    this.startClock();
  }

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  async fetchDevices() {
    try {
      const params = {};

      if (this.searchCondition) {
        if (this.searchType === 'id') {
          params.id = this.searchCondition;
        } else if (this.searchType === 'name') {
          params.deviceName = this.searchCondition;
        }
      }
      if (this.region) {
        params.region = this.region;
      }
      if (this.deviceStatus) {
        params.deviceStatus = this.deviceStatus;
      }

      console.log('查询参数:', params);

      const data = await api.devicesApi.query(params);
      if (Array.isArray(data)) {
        this.devices = data;
      } else {
        console.warn('API返回的数据不是数组格式:', data);
        this.devices = [];
      }
      this.requestUpdate();
    } catch (error) {
      console.error('获取设备信息失败:', error);
      this.devices = [];
      this.requestUpdate();
    }
  }

  handleRegionChange(event) {
    this.region = event.target.value;
    console.log('地区变更为:', this.region);
    this.fetchDevices();
  }

  handleDeviceStatusChange(event) {
    this.deviceStatus = event.target.value;
    console.log('设备状态变更为:', this.deviceStatus);
    this.fetchDevices();
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  clearSearchCondition() {
    this.searchCondition = '';
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
            <label for="search-type">查询方式:</label>
            <select
              id="search-type"
              @change="${this.handleSearchTypeChange}"
              .value="${this.searchType}"
            >
              <option value="id">设备编号</option>
              <option value="name">设备名称</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input
              type="text"
              id="search-condition"
              .value="${this.searchCondition}"
              @input="${this.handleSearchConditionChange}"
            />
            <button class="clear-button" @click="${this.clearSearchCondition}">
              清除
            </button>
          </div>
          <button class="query-button" @click="${this.fetchDevices}">
            查询
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select
              id="location"
              @change="${this.handleRegionChange}"
              .value="${this.region}"
            >
              <option value="">全部</option>
              <option value="中卫">中卫</option>
              <option value="嵩山">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type">
              <option value="自动角反射器">自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-status">设备状态:</label>
            <select
              id="device-status"
              @change="${this.handleDeviceStatusChange}"
              .value="${this.deviceStatus}"
            >
              <option value="">全部</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>设备编号</th>
                <th>设备名</th>
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
          <td>${device.deviceName}</td>
          <td>
            ${this.calculateRealTime(
              device.syncedDeviceTime,
              device.lastSyncTime
            )}
          </td>
          <td>${device.deviceType}</td>
          <td>${device.region}</td>
          <td>${device.connectionStatus}</td>
          <td>${device.powerStatus}</td>
          <td>${device.deviceStatus}</td>
          ${this.showActions
            ? html`
                <td>
                  <a
                    class="action-button"
                    @click="${() => this.adjustPosture(device)}"
                    >姿态调整</a
                  >
                  <span class="button-separator">/</span>
                  <a
                    class="action-button"
                    @click="${() => this.locateDevice(device)}"
                    >定位</a
                  >
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
    console.log('准备打开姿态调整，完整的设备数据:', device);
    // 创建一个自定义事件，包含完整的设备数据
    const event = new CustomEvent('open-posture-adjust', {
      detail: {
        device: {
          ...device,
          ytsbh: device.id, // 使用 id 作为设备编号
        },
      },
      bubbles: true,
      composed: true,
    });
    console.log('发送姿态调整事件，事件数据:', event.detail);
    this.dispatchEvent(event);
  }

  locateDevice(device) {
    try {
      // 确保经纬度值是有效的数值
      const lat = parseFloat(device.lat);
      const lon = parseFloat(device.lon);

      // 验证坐标是否在有效范围内
      if (
        isNaN(lat) ||
        isNaN(lon) ||
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
      ) {
        console.error('设备坐标无效:', {
          设备ID: device.id,
          设备名称: device.deviceName,
          纬度: lat,
          经度: lon,
        });
        return;
      }

      // 打印完整的设备信息以检查坐标
      console.log('设备定位信息:', {
        设备ID: device.id,
        设备名称: device.deviceName,
        原始坐标: {
          lat: device.lat,
          lon: device.lon,
        },
        转换后坐标: {
          lat: lat,
          lon: lon,
        },
      });

      // 发送定位事件
      const locationEvent = new CustomEvent('locate-device', {
        detail: {
          deviceId: device.id,
          deviceName: device.deviceName,
          lat: lat,
          lon: lon,
        },
      });

      console.log('发送定位事件:', locationEvent.detail);
      window.dispatchEvent(locationEvent);
    } catch (error) {
      console.error('定位设备时出错:', error);
    }
  }
  startClock() {
    setInterval(() => {
      this.currentTime = Date.now(); // 每秒更新当前时间戳
    }, 1000);
  }

  calculateRealTime(syncedDeviceTime, lastSyncTime) {
    if (!syncedDeviceTime || !lastSyncTime) return '-';
    const timeDiff = new Date(syncedDeviceTime) - new Date(lastSyncTime);
    const realTime = timeDiff + this.currentTime;
    return new Date(realTime).toLocaleTimeString();
  }
}

customElements.define('device-query', DeviceQuery);
