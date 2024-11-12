import { LitElement, html, css } from 'lit';
import { taskService } from '@/api/fetch.js'; // 引入任务服务

class TaskReviewComponent extends LitElement {
  static styles = css`
    .modal {
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 900px;
      height: 700px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      opacity: 1;
      border: 1px solid rgba(42, 130, 228, 1);
      background-size: cover;
      background-position: center;
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      text-align: left;
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 10px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    .form-group label {
      margin-right: 10px;
      white-space: nowrap;
    }
    .form-group select,
    .form-group input {
      padding: 5px;
      background-color: #1b2a41;
      color: white;
      border: none;
      border-radius: 5px;
    }
    .query-button {
      padding: 8px 15px;
      background-color: #58a6ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }

    th {
      background-color: #1a2b4c;
      padding: 8px;
      text-align: center;
      border-bottom: 2px solid #444;
    }

    .table-row {
      border-bottom: 1px solid #444;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    td {
      padding: 8px;
      text-align: center;
    }
    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }
    .status-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 81px;
      height: 20px;
      border-radius: 5px;
      margin-right: 5px;
    }

    .status-online {
      background-color: green;
    }
    .status-warning {
      background-color: orange;
    }
    .status-offline {
      background-color: red;
    }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
    .table-container {
      max-height: 565px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }
  `;
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
          <button class="query-button" @click="${this.fetchTaskReviews}">
            查询
          </button>
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
            <label for="review-status">审批状态:</label>
            <select id="review-status" style="background-color: gray;">
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
      new CustomEvent('open-task-review-detail', {
        detail: { task: taskReview, isReview: true },
      })
    );
  }

  openTaskReviewReview(taskReview) {
    this.dispatchEvent(
      new CustomEvent('open-task-review-review', {
        detail: { task: taskReview, isReview: true, isReviewEdit: true },
      })
    );
  }
}

customElements.define('task-review-component', TaskReviewComponent);
