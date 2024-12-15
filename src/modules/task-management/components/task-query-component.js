import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-query-component.css?inline';
import api from '@/apis/api.js';
import { showError } from '@/utils/notification.js';

class TaskQueryComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      tasks: { type: Array },
      searchType: { type: String },
      searchCondition: { type: String },
      deviceType: { type: String },
      region: { type: String },
      reviewStatus: { type: String },
    };
  }

  constructor() {
    super();
    this.tasks = [];
    this.searchType = 'taskNumber';
    this.searchCondition = '';
    this.deviceType = '自动角反射器';
    this.region = '';
    this.reviewStatus = '';
    
    // 添加地区映射对象
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.fetchTasks();

    window.addEventListener('tasks-updated', () => {
      this.fetchTasks();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('tasks-updated', () => {
      this.fetchTasks();
    });
  }

  async fetchTasks() {
    try {
      const params = {
        [this.searchType]: this.searchCondition,
        reviewStatus: this.reviewStatus,
        region: this.regionToChineseMap[this.region] || this.region,
      };
      Object.keys(params).forEach((key) => {
        if (
          params[key] === '' ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });
      const data = await api.tasksWithDevicesApi.query(params);
      if (Array.isArray(data)) {
        this.tasks = data;
      } else {
        console.warn('API返回的数据不是数组格式:', data);
        this.tasks = [];
      }
    } catch (error) {
      showError('获取任务列表失败');
      console.error('具体错误:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
  }

  handleRegionChange(event) {
    this.region = event.target.value;
    this.fetchTasks();
  }

  handleTaskStatusChange(event) {
    this.reviewStatus = event.target.value;
    this.fetchTasks();
  }

  clearSearchCondition() {
    this.searchCondition = '';
    this.fetchTasks();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          任务查询<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询方式:</label>
            <select
              id="search-type"
              @change="${this.handleSearchTypeChange}"
              .value="${this.searchType}"
            >
              <option value="taskNumber">任务编号</option>
              <option value="taskName">任务名称</option>
              <option value="userId">用户ID</option>
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
          <button class="query-button" @click="${this.fetchTasks}">查询</button>
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
              <option value="zhongwei">中卫</option>
              <option value="songshan">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select
              id="device-type"
              @change="${this.handleDeviceTypeChange}"
              .value="${this.deviceType}"
            >
              <option value="自动角反射器">自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="task-status">审批状态:</label>
            <select
              id="task-status"
              @change="${this.handleTaskStatusChange}"
              .value="${this.reviewStatus}"
            >
              <option value="">全部</option>
              <option value="approved">已批准</option>
              <option value="pending">待审批</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>任务名</th>
                <th>任务编号</th>
                <th>提交用户名</th>
                <th>设备类型</th>
                <th>所属地区</th>
                <th>审批状态</th>
                <th>设备开启时间</th>
                <th>设备关闭时间</th>
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
    return this.tasks.map(
      (task) => html`
        <tr class="table-row">
          <td>${task.taskName}</td>
          <td>${task.taskNumber}</td>
          <td>${task.userId}</td>
          <td>${task.deviceType || '未知'}</td>
          <td>${task.region || '未知'}</td>
          <td>${task.reviewStatus || '未知'}</td>
          <td>${task.startTime || '-'}</td>
          <td>${task.endTime || '-'}</td>
          <td>
            <a @click="${() => this.openTaskDetails(task, false)}">查看</a>
          </td>
          <td><a @click="${() => this.openFaultDetails()}">查看</a></td>
          <td><a @click="${() => this.openTaskLog()}">查看</a></td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openTaskDetails(task, isEdit = false) {
    this.dispatchEvent(
      new CustomEvent('open-task-details', {
        detail: { task, isEdit },
        bubbles: true,
        composed: true,
      })
    );
  }

  openFaultDetails() {
    this.dispatchEvent(new CustomEvent('open-fault-details'));
  }

  openTaskLog() {
    this.dispatchEvent(new CustomEvent('open-task-log-component'));
  }
}

customElements.define('task-query-component', TaskQueryComponent);
