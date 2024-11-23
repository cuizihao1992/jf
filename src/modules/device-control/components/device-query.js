import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-query.css?inline';
import api from '@/apis/api';
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
      const filters = {};
      const data = await api.devicesApi.query(filters);
      // const data = await deviceService.list(params);
      // this.devices = data.rows;
      this.devices = data;
    } catch (error) {
      console.error('获取设备信息失败:', error);
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
                  <a class="action-button" @click="${this.adjustPosture}"
                    >姿态调整</a
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

  adjustPosture() {
    this.dispatchEvent(new CustomEvent('open-posture-adjust'));
  }
}

customElements.define('device-query', DeviceQuery);
