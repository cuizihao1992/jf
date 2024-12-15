import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-log.css?inline';

class TaskLog extends LitElement {
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
    this.searchType = 'logType';
    this.searchCondition = '';
    this.region = '';
    this.deviceType = '';
    
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.logTypeMap = {
      'create': '创建任务',
      'modify': '修改任务',
      'delete': '删除任务',
      'complete': '完成任务',
      'review': '审核任务'
    };
    
    this.fetchTaskLogs();
  }

  async fetchTaskLogs() {
    try {
      const params = {};
      if (this.searchCondition) {
        if (this.searchType === 'logId') {
          params.logId = this.searchCondition;
        } else if (this.searchType === 'logType') {
          const englishType = Object.keys(this.logTypeMap).find(
            key => this.logTypeMap[key] === this.searchCondition
          );
          params.logType = englishType || this.searchCondition;
        } else if (this.searchType === 'userName') {
          params.userName = this.searchCondition;
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
    this.fetchTaskLogs();
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
            <button class="clear-button" @click="${this.clearSearchCondition}">
              清除
            </button>
          </div>
          <button class="query-button" @click="${this.fetchTaskLogs}">查询</button>
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
    return this.taskLogs.map(log => html`
      <tr>
        <td>${log.logId}</td>
        <td>${log.timestamp}</td>
        <td>${log.userName}</td>
        <td>${this.logTypeMap[log.logType] || log.logType}</td>
        <td>${this.regionToChineseMap[log.region] || log.region}</td>
        <td>${log.deviceType}</td>
        <td><a @click="${() => this.openTaskDetails()}">查看</a></td>
        <td><a @click="${() => this.openFaultDetails()}">查看</a></td>
        <td><a @click="${() => this.openTaskLog()}">查看</a></td>
      </tr>
    `);
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
