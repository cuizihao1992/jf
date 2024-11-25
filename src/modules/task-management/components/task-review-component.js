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
      searchType: { type: String },
      searchCondition: { type: String },
      reviewStatus: { type: String },
      region: { type: String },
      deviceType: { type: String },
    };
  }

  constructor() {
    super();
    this.taskReviews = [];
    this.searchType = 'taskNumber'; // 默认查询类型为任务编号
    this.searchCondition = ''; // 查询条件
    this.reviewStatus = ''; // 审批状态
    this.region = '中卫'; // 默认地区
    this.deviceType = '自动角反射器'; // 默认设备类型
    this.fetchTaskReviews();
  }

  async fetchTaskReviews() {
    try {
      const params = {
        [this.searchType]: this.searchCondition, // 动态属性查询
        reviewStatus: this.reviewStatus,
        region: this.region,
        deviceType: this.deviceType,
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
      const data = await api.tasksWithDevicesApi.query({});
      this.taskReviews = data;
    } catch (error) {
      console.error('获取任务审核列表失败:', error);
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

  handleRegionChange(event) {
    this.region = event.target.value;
  }

  handleDeviceTypeChange(event) {
    this.deviceType = event.target.value;
  }

  clearSearchCondition() {
    this.searchCondition = '';
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          审核列表<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">任务查询类型:</label>
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
          </div>
          <button class="query-button" @click="${this.fetchTaskReviews}">
            查询
          </button>
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
              <option value="中卫">中卫</option>
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
            <label for="review-status">审批状态:</label>
            <select
              id="review-status"
              @change="${this.handleReviewStatusChange}"
              .value="${this.reviewStatus}"
            >
              <option value="">全部</option>
              <option value="pending">待审批</option>
              <option value="approved">已批准</option>
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

    return this.taskReviews.map(
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
    );
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
