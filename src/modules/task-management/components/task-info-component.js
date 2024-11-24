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
      currentTask: { type: Object }, // 保存当前操作的任务
    };
  }

  constructor() {
    super();
    this.tasks = [];
    this.showConfirmation = false;
    this.searchType = 'taskNumber'; // 默认查询类型为任务编号
    this.searchCondition = ''; // 查询条件初始化为空
    this.reviewStatus = ''; // 审批状态初始化为空
    this.currentTask = null; // 初始化当前任务为空
    this.fetchTasks();

    // 监听任务更新事件
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
            <select id="device-type">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location">
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
    `;
  }

  renderRows() {
    const statusMap = {
      pending: '审核中',
      approved: '通过',
      rejected: '驳回',
    };

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
          <td>${statusMap[task.reviewStatus] || '未知状态'}</td>
          <td>
            <a @click="${() => this.openTaskDetails(task, 'view')}">查看</a> /
            <a @click="${() => this.openTaskDetails(task, 'edit')}">编辑</a> /
            <a @click="${() => this.openDeleteConfirmation(task)}">撤回</a>
            <!-- 修改为删除逻辑 -->
          </td>
        </tr>
      `
    );
  }

  openDeleteConfirmation(task) {
    this.showConfirmation = true;
    this.currentTask = task; // 保存当前操作的任务
  }

  async confirmDelete() {
    try {
      await taskService.delete(this.currentTask.taskId); // 使用 taskId 调用删除 API
      this.fetchTasks(); // 重新获取任务列表以刷新表格
      this.showConfirmation = false;
    } catch (error) {
      console.error('删除任务失败:', error);
    }
  }

  cancelDelete() {
    this.showConfirmation = false;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openTaskDetails(task, type) {
    this.dispatchEvent(
      new CustomEvent('open-task-details', {
        detail: {
          task: { ...task },
          mode: {
            isEdit: type === 'edit',
            isReview: false,
            isReviewEdit: false,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('task-info-component', TaskInfoComponent);
