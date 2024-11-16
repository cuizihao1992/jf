import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/task-review-component.css?inline';
import { taskService } from '@/api/fetch.js';

class TaskReviewComponent extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  static get properties() {
    return {
      taskReviews: { type: Array }, // 添加任务审核属性
    };
  }

  constructor() {
    super();
    this.taskReviews = [];
    this.fetchTaskReviews(); // 初始化时获取任务审核数据
  }

  async fetchTaskReviews() {
    try {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        // 可以根据需要添加其他查询参数
      };
      const data = await taskService.list(params);
      this.taskReviews = data.rows;
    } catch (error) {
      console.error('获取任务审核列表失败:', error);
    }
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
            <select id="search-type">
              <option>任务编号</option>
            </select>
          </div>
          <div class="form-group">
            <label for="search-condition">查询条件:</label>
            <input type="text" id="search-condition" />
          </div>
          <button class="query-button" @click="${this.fetchTaskReviews}">查询</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">设备类型:</label>
            <select id="device-type">
              <option>自动角反射器</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审批状态:</label>
            <select id="review-status">
              <option>已提交</option>
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
    return this.taskReviews.map(
      (taskReview) => html`
        <tr class="table-row">
          <td>${taskReview.taskName}</td>
          <td>${taskReview.taskNumber}</td>
          <td>${taskReview.userId}</td>
          <td>${taskReview.deviceType || '-'}</td>
          <td>${taskReview.region || '-'}</td>
          <td>${taskReview.createdTime}</td>
          <td>${taskReview.reviewStatus}</td>
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
            isReviewEdit: false
          }
        },
        bubbles: true,
        composed: true
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
            isReviewEdit: true
          }
        },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define('task-review-component', TaskReviewComponent);
