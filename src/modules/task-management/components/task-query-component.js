import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-query-component.css?inline';
import api from '@/apis/api.js';

class TaskQueryComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;
  static get properties() {
    return {
      tasks: { type: Array }, // 添加设备审核属性
    };
  }
  constructor() {
    super();
    this.tasks = [];
    this.showConfirmation = false;
    this.searchType = 'taskNumber'; // 默认查询类型为任务编号
    this.searchCondition = ''; // 查询条件初始化为空
    this.reviewStatus = ''; // 审批状态初始化为空
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const params = {
        [this.searchType]: this.searchCondition, // 动态属性查询
        reviewStatus: this.reviewStatus, // 审批状态过滤
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
      const data = await api.tasksApi.query(params);
      this.tasks = data;
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  handleReviewStatusChange(event) {
    this.reviewStatus = event.target.value;
  }

  clearSearchCondition() {
    this.searchCondition = '';
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
            <label for="task-status">任务状态:</label>
            <select id="task-status" style="background-color: gray;">
              <option>未完成</option>
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
                <th>任务状态</th>
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
      (task, index) => html`
        <tr class="table-row">
          <td>${task.taskName}</td>
          <td>${task.taskNumber}</td>
          <td>${task.userId}</td>
          <td>${task.deviceType}</td>
          <td>${task.region}</td>
          <td>${task.taskStatus}</td>
          <td>${task.startTime}</td>
          <td>${task.endTime}</td>

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
    console.log('open task details');

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
