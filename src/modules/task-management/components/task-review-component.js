import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-review-component.css?inline';
import api from '@/apis/api.js';

class TaskReviewComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;
  static get properties() {
    return {
      taskReviews: { type: Array },
      showConfirmation: { type: Boolean },
      searchType: { type: String },
      searchCondition: { type: String },
      reviewStatus: { type: String },
      currentTask: { type: Object },
      region: { type: String },
    };
  }

  constructor() {
    super();
    this.taskReviews = [];
    this.showConfirmation = false;
    this.searchType = 'taskNumber'; // 默认查询类型为任务编号
    this.searchCondition = ''; // 查询条件初始化为空
    this.reviewStatus = ''; // 审批状态初始化为空
    this.currentTask = null; // 初始化当前任务为空
    this.region = ''; // 初始化地区为空
    
    // 添加地区映射对象
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
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
        [this.searchType]: this.searchCondition,
        region: this.regionToChineseMap[this.region] || this.region,
      };

      // 只在审批状态不为空时添加到查询参数
      if (this.reviewStatus) {
        params.reviewStatus = this.reviewStatus;
      }

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
      this.taskReviews = data;
    } catch (error) {
      showToast({ message: '获取任务列表失败', type: 'error', duration: 3000 });
      console.error('获取任务列表失败:', error);
    }
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
    if (this.searchCondition) {
      this.fetchTasks();
    }
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
    if (!this.searchCondition) {
      this.fetchTasks();
    }
  }

  handleReviewStatusChange(event) {
    this.reviewStatus = event.target.value;
    this.fetchTasks();
  }

  handleRegionChange(event) {
    this.region = event.target.value;
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
            <select id="location" @change="${this.handleRegionChange}" .value="${this.region}">
              <option value="">全部</option>
              <option value="zhongwei">中卫</option>
              <option value="songshan">嵩山</option>
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
                <th>任务名</th>
                <th>任务编号</th>
                <th>提交用户名</th>
                <th>设备类型</th>
                <th>所属地区</th>
                <th>任务提交时间</th>
                <th>审批状态</th>
                <th>任务审核</th>
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
    const statusMap = {
      pending: '待审批',
      approved: '已批准',
      rejected: '已拒绝',
    };

    return Array.isArray(this.taskReviews) ? this.taskReviews.map(
      (taskReview) => html`
        <tr class="table-row">
          <td>${taskReview.taskName}</td>
          <td>${taskReview.taskNumber}</td>
          <td>${taskReview.userId}</td>
          <td>${taskReview.deviceType || '-'}</td>
          <td>${taskReview.region || '-'}</td>
          <td>${taskReview.createdTime}</td>
          <td>${statusMap[taskReview.reviewStatus] || '未知状态'}</td>
          <td>
            <a @click="${() => this.openTaskReviewDetails(taskReview)}">查看</a>
            /
            <a @click="${() => this.openTaskReviewReview(taskReview)}">审核</a>
          </td>
        </tr>
      `
    ) : [];
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openTaskReviewDetails(taskReview) {
    this.dispatchEvent(
      new CustomEvent('open-task-details', {
        detail: {
          task: { ...taskReview },
          mode: {
            isEdit: false,
            isReview: true,
            isReviewEdit: false,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  openTaskReviewReview(taskReview) {
    this.dispatchEvent(
      new CustomEvent('open-task-details', {
        detail: {
          task: { ...taskReview },
          mode: {
            isEdit: false,
            isReview: true,
            isReviewEdit: true,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('task-review-component', TaskReviewComponent);
