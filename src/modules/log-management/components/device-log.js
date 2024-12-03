import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-log.css?inline';
import api from '@/apis/api';

class DeviceLog extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      deviceLogs: { type: Array },
      searchType: { type: String },
      searchCondition: { type: String },
      region: { type: String },
      deviceType: { type: String }
    };
  }

  constructor() {
    super();
    this.deviceLogs = [];
    this.searchType = 'deviceId';
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    this.fetchDeviceLogs();
  }

  async fetchDeviceLogs() {
    try {
      const params = {
        [this.searchType]: this.searchCondition,
        region: this.region,
        deviceType: this.deviceType
      };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const data = await api.deviceLogsApi.query(params);
      this.deviceLogs = data;
    } catch (error) {
      console.error('获取设备日志失败:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleRegionChange(event) {
    this.region = event.target.value;
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
  }

  clearSearchCondition() {
    // 重置所有筛选条件
    this.searchCondition = '';
    this.searchType = 'deviceId';
    this.region = '';
    this.deviceType = '';
    
    // 重置下拉框选项
    const locationSelect = this.shadowRoot.querySelector('#location');
    const deviceTypeSelect = this.shadowRoot.querySelector('#device-type');
    const searchTypeSelect = this.shadowRoot.querySelector('#search-type');
    
    if (locationSelect) locationSelect.value = '';
    if (deviceTypeSelect) deviceTypeSelect.value = '';
    if (searchTypeSelect) searchTypeSelect.value = 'deviceId';
    
    // 刷新数据
    this.fetchDeviceLogs();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          设备日志查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" .value="${this.searchType}" @change="${this.handleSearchTypeChange}">
              <option value="deviceId">设备编号</option>
              <option value="logId">日志编号</option>
              <option value="eventType">日志类型</option>
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
          </div>
          <button class="clear-button" @click="${this.clearSearchCondition}">删除</button>
          <button class="query-button" @click="${this.fetchDeviceLogs}">查询</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" @change="${this.handleRegionChange}">
              <option value="">全部</option>
              <option value="中卫">中卫</option>
              <option value="嵩山">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type" @change="${this.handleDeviceTypeChange}">
              <option value="">全部</option>
              <option value="自动角反射器">自动角反射器</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>日志编号</th>
                <th>日志生成时间</th>
                <th>操作用户</th>
                <th>日志类型</th>
                <th>所属地区</th>
                <th>设备类型</th>
                <th>操作内容</th>
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
    return this.deviceLogs.map(
      (log) => html`
        <tr class="table-row">
          <td>${log.logId}</td>
          <td>${log.timestamp}</td>
          <td>${log.userId}</td>
          <td>${log.eventType}</td>
          <td>${log.region}</td>
          <td>${log.deviceType}</td>
          <td>${log.eventDescription}</td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-log', DeviceLog);
