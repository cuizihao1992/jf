import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-edit.css?inline';
import api from '@/apis/api.js';

class DeviceEdit extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;
  static get properties() {
    return {
      devices: { type: Array },
      showConfirmation: { type: Boolean },
      currentDevice: { type: Object },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.showConfirmation = false;
    this.currentDevice = null;
    this.fetchDevices();
  }

  async fetchDevices() {
    try {
      const data = await api.devicesApi.query({});
      this.devices = data;
    } catch (error) {
      console.error('获取设备审核数据失败:', error);
      showToast({ message: '获取设备数据失败', type: 'error', duration: 3000 });
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
                <th>设备时间</th>
                <th>设备类型</th>
                <th>所属地区</th>
                <th>连接状态</th>
                <th>电源状态</th>
                <th>设备状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
        ${this.showConfirmation
          ? html`
              <div class="confirmation-modal">
                <div style="font-size: 16px; font-weight: bold;">提示</div>
                <div style="margin: 20px 0;">是否删除此设备?</div>
                <div class="confirmation-buttons">
                  <button class="confirm-button" @click="${this.confirmDelete}">
                    确定
                  </button>
                  <button class="cancel-button" @click="${this.cancelDelete}">
                    取消
                  </button>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  renderRows() {
    return this.devices.map(
      (device) => html`
        <tr class="table-row">
          <td>${device.id}</td>
          <td>${device.lastSyncTime}</td>
          <td>${device.deviceType}</td>
          <td>${device.region}</td>
          <td>${device.connectionStatus}</td>
          <td>
            <span class="status-icon status-online">${device.powerStatus}</span>
          </td>
          <td>${device.deviceStatus}</td>
          <td>
            <a @click="${() => this.openDeviceParticulars(device, 'view')}"
              >查看</a
            >
            /
            <a @click="${() => this.openDeviceParticulars(device, 'edit')}"
              >编辑</a
            >
            /
            <a @click="${() => this.openRevokeConfirmation(device)}">删除</a>
          </td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openDevicexiangqing() {
    this.dispatchEvent(
      new CustomEvent('open-device-xiangqing')
    ); /*this.showConfirmation=false;
    this.dispatchEvent(new CustomEvent('open-task-details'));*/
  }
  openDeviceParticulars(device, type) {
    this.dispatchEvent(
      new CustomEvent('open-device-particulars', {
        detail: {
          device: { ...device },
          mode: {
            isEdit: type === 'edit',
            isReview: false,
            isReviewEdit: false,
          },
        },
      })
    );
  }
  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openRevokeConfirmation(device) {
    this.showConfirmation = true;
    this.currentDevice = device;
  }

  async confirmDelete() {
    try {
      await api.devicesApi.delete(this.currentDevice.id);
      this.fetchDevices();
      this.showConfirmation = false;
      showToast({ message: '删除成功', type: 'success', duration: 3000 });
    } catch (error) {
      showToast({ message: error.message, type: 'error', duration: 3000 });
      console.error('删除设备失败:', error);
    }
  }

  cancelDelete() {
    this.showConfirmation = false;
    this.currentDevice = null;
  }
}

customElements.define('device-edit', DeviceEdit);
