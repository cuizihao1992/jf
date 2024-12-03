import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-search.css?inline';
import api from '@/apis/api.js';

class DeviceSearch extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      devices: { type: Array },
      currentTime: { type: Number }, // 当前时间戳
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.currentTime = Date.now();
    this.searchType = 'id';
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '自动角反射器';
    this.deviceStatus = '';
    
    // 添加地区映射对象
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.fetchDevices();
    this.startClock();
  }

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
        params.region = this.regionToChineseMap[this.region] || this.region;
      }
      if (this.deviceStatus) {
        params.deviceStatus = this.deviceStatus;
      }
      if (this.deviceType) {
        params.deviceType = this.deviceType;
      }
      
      const data = await api.devicesApi.query(params);
      this.devices = data;
    } catch (error) {
      showToast({ message: '获取设备数据失败', type: 'error', duration: 3000 });
      console.error('获取设备审核数据失败:', error);
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
    return new Date(realTime).toLocaleTimeString(); // 返回格式化时间
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleRegionChange(event) {
    this.region = event.target.value;
    this.fetchDevices();
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
    this.fetchDevices();
  }

  handleDeviceStatusChange(event) {
    this.deviceStatus = event.target.value;
    this.fetchDevices();
  }

  clearSearchCondition() {
    // 清除搜索条件
    this.searchCondition = '';
    // 清除下拉框筛选
    this.region = '';
    this.deviceType = '自动角反射器';  // 设置为默认值
    this.deviceStatus = '';
    
    // 重置下拉框选项
    const locationSelect = this.shadowRoot.querySelector('#location');
    const deviceTypeSelect = this.shadowRoot.querySelector('#device-type');
    const deviceStatusSelect = this.shadowRoot.querySelector('#device-status');
    
    if (locationSelect) locationSelect.value = '';
    if (deviceTypeSelect) deviceTypeSelect.value = '自动角反射器';
    if (deviceStatusSelect) deviceStatusSelect.value = '';
    
    // 刷新数据
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
            <select id="search-type" @change="${this.handleSearchTypeChange}" .value="${this.searchType}">
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
            <button class="clear-button" @click="${this.clearSearchCondition}">清除</button>
          </div>
          <button class="query-button" @click="${this.fetchDevices}">查询</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" @change="${this.handleRegionChange}" .value="${this.region}">
              <option value="">全部</option>
              <option value="zhongwei">中卫</option>
              <option value="songshan">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" @change="${this.handleDeviceTypeChange}" .value="${this.deviceType}">
              <option value="自动角反射器">自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-status">设备状态:</label>
            <select id="device-status" @change="${this.handleDeviceStatusChange}" .value="${this.deviceStatus}">
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
                <th>设备详情</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
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
          <td>
            <span class="status-icon status-online">${device.powerStatus}</span>
          </td>
          <td>${device.deviceStatus}</td>
          <td>
            <a @click="${() => this.openDeviceParticulars(device)}">查看</a>
            <span class="button-separator">/</span>
            <a @click="${() => this.locateDevice(device)}">定位</a>
          </td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openDeviceParticulars(device) {
    this.dispatchEvent(
      new CustomEvent('open-device-particulars', {
        detail: {
          device,
          mode: {
            isEdit: false,
            isReview: false,
            isReviewEdit: false,
          },
        },
      })
    );
  }

  locateDevice(device) {
    try {
      const lat = parseFloat(device.lat);
      const lon = parseFloat(device.lon);

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

      const locationEvent = new CustomEvent('locate-device', {
        detail: {
          deviceId: device.id,
          deviceName: device.deviceName,
          lat: lat,
          lon: lon,
        },
      });

      window.dispatchEvent(locationEvent);
    } catch (error) {
      console.error('定位设备时出错:', error);
    }
  }
}

customElements.define('device-search', DeviceSearch);
