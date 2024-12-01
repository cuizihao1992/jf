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
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.fetchDevices(); // 初始化时获取设备审核数据
  }

  async fetchDevices() {
    try {
      const data = await api.devicesApi.query({});
      this.devices = data;
    } catch (error) {
      showToast({ message: '获取设备数据失败', type: 'error', duration: 3000 });
      console.error('获取设备审核数据失败:', error);
    }
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
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" style="background-color: gray;">
              <option>设备编号</option>
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
          <button class="query-button">查询</button>
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
            <label for="device-status">设备状态:</label>
            <select id="device-status" style="background-color: gray;">
              <option>关机</option>
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
          <td>${device.installTime}</td>
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
      // 确保经纬度值是有效的数值
      const lat = parseFloat(device.lat);
      const lon = parseFloat(device.lon);

      // 验证坐标是否在有效范围内
      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        console.error('设备坐标无效:', {
          设备ID: device.id,
          设备名称: device.deviceName,
          纬度: lat,
          经度: lon
        });
        return;
      }

      // 发送定位事件
      const locationEvent = new CustomEvent('locate-device', {
        detail: {
          deviceId: device.id,
          deviceName: device.deviceName,
          lat: lat,
          lon: lon
        }
      });

      window.dispatchEvent(locationEvent);
    } catch (error) {
      console.error('定位设备时出错:', error);
    }
  }
}

customElements.define('device-search', DeviceSearch);
