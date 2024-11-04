import { LitElement, html, css, unsafeCSS } from 'lit';
import { taskService } from '@/api/fetch.js';
import styles from './css/task-info-component.css?inline'; // 导入 CSS 文件

class TaskInfoComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `; // 使用外部 CSS 文件的样式

  static get properties() {
    return {
      tasks: { type: Array },
      showConfirmation: { type: Boolean },
      searchType: { type: String },
      searchCondition: { type: String },
      reviewStatus: { type: String },
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
        pageNum: 1,
        pageSize: 100000,
        [this.searchType]: this.searchCondition, // 动态属性查询
        reviewStatus: this.reviewStatus, // 审批状态过滤
      };
      const data = await taskService.list(params);
      this.tasks = data.rows;
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
          任务信息<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
            <select id="search-type" @change="${this.handleSearchTypeChange}">
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
            <label for="device-type">设备类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select
              id="review-status"
              @change="${this.handleReviewStatusChange}"
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
                <th>序号</th>
                <th>任务名</th>
                <th>任务编号</th>
                <th>提交用户ID</th>
                <th>设备ID列表</th>
                <th>所属地区</th>
                <th>审批状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>

      ${this.showConfirmation
        ? html`
            <div class="confirmation-modal">
              <div>提示:</div>
              <div>是否撤回此任务!!</div>
              <div class="confirmation-buttons">
                <button class="confirm-button" @click="${this.confirmRevoke}">
                  确定
                </button>
                <button class="cancel-button" @click="${this.cancelRevoke}">
                  取消
                </button>
              </div>
            </div>
          `
        : ''}
    `;
  }

  renderRows() {
    // 使用 tasks 数据渲染表格行
    return this.tasks.map(
      (task, index) => html`
        <tr class="table-row">
          <td>${index + 1}</td>
          <td>${task.taskName}</td>
          <td>${task.taskNumber}</td>
          <td>${task.userId}</td>
          <td>${task.deviceIds}</td>
          <td>${task.region}</td>
          <td>${task.reviewStatus}</td>
          <td>
            <a @click="${() => this.openTaskDetails(task)}">查看</a> /
            <a @click="${() => this.openTaskEdit(task)}">编辑</a> /
            <a @click="${() => this.openRevokeConfirmation(task)}">撤回</a>
          </td>
        </tr>
      `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openTaskDetails(task) {
    this.dispatchEvent(
      new CustomEvent('open-task-details', { detail: task, isEdit: false })
    );
  }

  openTaskEdit(task) {
    this.dispatchEvent(
      new CustomEvent('open-task-edit', { detail: task, isEdit: true })
    );
  }

  openRevokeConfirmation(task) {
    this.showConfirmation = true;
    this.currentTask = task; // 保存当前操作的任务
  }

  confirmRevoke() {
    this.showConfirmation = false;
    console.log('任务撤回确认:', this.currentTask);
    // 撤回逻辑可在此添加
  }

  cancelRevoke() {
    this.showConfirmation = false;
  }
}

customElements.define('task-info-component', TaskInfoComponent);
