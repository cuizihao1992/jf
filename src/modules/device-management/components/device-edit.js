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
      currentTime: { type: Number }, // 当前时间戳
      searchType: { type: String },
      searchCondition: { type: String },
      region: { type: String },
      deviceType: { type: String },
      deviceStatus: { type: String },
    };
  }

  constructor() {
    super();
    this.devices = [];
    this.showConfirmation = false;
    this.currentDevice = null;
    this.currentTime = Date.now(); // 初始化当前时间戳
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
    this.startClock(); // 启动实时更新时钟
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
      console.error('获取设备审核数据失败:', error);
      showToast({ message: '获取设备数据失败', type: 'error', duration: 3000 });
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
            <a @click="${() => this.openDeviceParticulars(device, 'view')}">
              查看</a
            >
            /
            <a @click="${() => this.openDeviceParticulars(device, 'edit')}">
              编辑</a
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
      window.dispatchEvent(
        new CustomEvent('devices-updated', {
          detail: {
            devices: this.devices,
          },
        })
      );
      this.showConfirmation = false;
      this.currentDevice = null;
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
}

customElements.define('device-edit', DeviceEdit);
