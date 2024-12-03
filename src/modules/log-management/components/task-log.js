import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-log.css?inline';

class TaskLog extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      taskLogs: { type: Array },
      searchType: { type: String },
      searchCondition: { type: String },
      region: { type: String },
      deviceType: { type: String }
    };
  }

  constructor() {
    super();
    this.taskLogs = [];
    this.searchType = 'logType'; // 默认查询类型
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    this.fetchTaskLogs();
  }

  async fetchTaskLogs() {
    try {
      const params = {
        [this.searchType]: this.searchCondition,
        region: this.region,
        deviceType: this.deviceType
      };
      // 移除空值参数
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const data = await api.taskLogsApi.query(params);
      this.taskLogs = data;
    } catch (error) {
      console.error('获取任务日志失败:', error);
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
    this.searchType = 'logType';
    this.region = '';
    this.deviceType = '';
    
    // 重置下拉框选项
    const locationSelect = this.shadowRoot.querySelector('#location');
    const deviceTypeSelect = this.shadowRoot.querySelector('#device-type');
    const searchTypeSelect = this.shadowRoot.querySelector('#search-type');
    
    if (locationSelect) locationSelect.value = '';
    if (deviceTypeSelect) deviceTypeSelect.value = '';
    if (searchTypeSelect) searchTypeSelect.value = 'logType';
    
    // 刷新数据
    this.fetchTaskLogs();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          任务日志查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">日志查询方式:</label>
            <select id="search-type" .value="${this.searchType}" @change="${this.handleSearchTypeChange}">
              <option value="logType">日志类型</option>
              <option value="logId">日志编号</option>
              <option value="userName">操作用户</option>
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
          <button class="query-button" @click="${this.fetchTaskLogs}">查询</button>
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
                <th>任务详情</th>
                <th>故障详情</th>
                <th>日志详情</th>
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
    return this.taskLogs.map(
      (taskLog) => html`
      <tr class="table-row">
        <td>${taskLog.logId}</a></td>
        <td>${taskLog.logTime}</td>
        <td>${taskLog.userName}</td>
        <td>${taskLog.logType}</td>
        <td>${taskLog.region}</td>
        <td>${taskLog.deviceType}</td>
        <td><a @click="${() => this.openTaskDetails()}">查看</a></td>
        <td><a @click="${() => this.openFaultDetails()}">查看</a></td>
        <td><a @click="${() => this.openTaskLog()}">查看</a></td>
      </tr>
    `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openTaskDetails() {
    this.dispatchEvent(new CustomEvent('open-task-details'));
  }

  openFaultDetails() {
    this.dispatchEvent(new CustomEvent('open-fault-details'));
  }
  openTaskLog() {
    this.dispatchEvent(new CustomEvent('open-task-log-component'));
  }
}

customElements.define('task-log', TaskLog);
