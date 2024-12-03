import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-log.css?inline';
import api from '@/apis/api';

class DeviceLog extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
    
    .clear-button {
      margin-left: 5px;
      padding: 5px 10px;
      background-color: #d9534f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .clear-button:hover {
      background-color: #c9302c;
    }
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
    this.searchType = 'logId';
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    
    // 添加地区映射对象
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    // 完善日志类型映射
    this.logTypeMap = {
      'operation': '操作日志',
      'system': '系统日志',
      'error': '错误日志',
      'warning': '警告日志',
      'info': '信息日志',
      'debug': '调试日志',
      'OPERATION': '操作日志',
      'SYSTEM': '系统日志',
      'ERROR': '错误日志',
      'WARNING': '警告日志',
      'INFO': '信息日志',
      'DEBUG': '调试日志'
    };
    
    this.fetchDeviceLogs();
  }

  async fetchDeviceLogs() {
    try {
      const params = {};
      if (this.searchCondition) {
        if (this.searchType === 'logId') {
          params.logId = this.searchCondition;
        } else if (this.searchType === 'eventType') {
          // 如果是按日志类型查询，需要将中文转换为英文
          const englishType = Object.keys(this.logTypeMap).find(
            key => this.logTypeMap[key].toLowerCase() === this.searchCondition.toLowerCase()
          );
          params.eventType = englishType || this.searchCondition;
        }
      }
      if (this.region) {
        params.region = this.regionToChineseMap[this.region] || this.region;
      }
      if (this.deviceType) {
        params.deviceType = this.deviceType;
      }
      
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
    this.fetchDeviceLogs(); // 直接触发查询
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
  }

  clearSearchCondition() {
    // 重置所有筛选条件
    this.searchCondition = '';
    this.searchType = 'logId';
    this.region = '';
    this.deviceType = '';
    
    // 重置下拉框选项
    const locationSelect = this.shadowRoot.querySelector('#location');
    const deviceTypeSelect = this.shadowRoot.querySelector('#device-type');
    const searchTypeSelect = this.shadowRoot.querySelector('#search-type');
    
    if (locationSelect) locationSelect.value = '';
    if (deviceTypeSelect) deviceTypeSelect.value = '';
    if (searchTypeSelect) searchTypeSelect.value = 'logId';
    
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
            <button class="clear-button" @click="${this.clearSearchCondition}">
              清除
            </button>
          </div>
          <button class="query-button" @click="${this.fetchDeviceLogs}">查询</button>
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
    return this.deviceLogs.map(log => html`
      <tr>
        <td>${log.logId}</td>
        <td>${log.timestamp}</td>
        <td>${log.userId}</td>
        <td>${this.logTypeMap[log.eventType] || this.logTypeMap[log.eventType?.toUpperCase()] || log.eventType}</td>
        <td>${this.regionToChineseMap[log.region] || log.region}</td>
        <td>${log.deviceType}</td>
        <td>${log.eventDescription}</td>
      </tr>
    `);
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('device-log', DeviceLog);
