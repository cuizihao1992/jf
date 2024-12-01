import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/audit-user.css?inline';
import api from '@/apis/api.js';

class AuditUserComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    applications: { type: Array },
    filteredApplications: { type: Array }, // 过滤后的数据
    approvalType: { type: String },
    userType: { type: String },
    region: { type: String },
    reviewStatus: { type: String },
  };

  constructor() {
    super();
    this.applications = [];
    this.filteredApplications = []; // 初始化为空数组
    this.approvalType = '';
    this.userType = '';
    this.region = '';
    this.reviewStatus = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApplications();
  }

  async loadApplications() {
    try {
      this.applications = await api.userReviewApi.query({});
      this.filteredApplications = [...this.applications]; // 初始化过滤列表
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  }

  // 查询按钮点击事件
  onQueryClick() {
    this.filteredApplications = this.applications.filter((application) => {
      return (
        (!this.approvalType ||
          application.applicationType === this.approvalType) &&
        (!this.userType || application.userType === this.userType) &&
        (!this.region || application.region === this.region) &&
        (!this.reviewStatus || application.reviewStatus === this.reviewStatus)
      );
    });
  }

  // 清除按钮点击事件
  onClearClick() {
    this.approvalType = '';
    this.userType = '';
    this.region = '';
    this.reviewStatus = '';
    this.filteredApplications = [...this.applications]; // 重置过滤列表
  }

  // 审核状态英文转中文
  getReviewStatusInChinese(status) {
    const statusMap = {
      submitted: '已提交',
      approved: '已通过',
      rejected: '已拒绝',
      pending: '待审核',
    };
    return statusMap[status] || status;
  }

  // 显示中文状态值
  getReviewStatusOptions() {
    return [
      { value: 'submitted', label: '已提交' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' },
      { value: 'pending', label: '待审核' },
    ];
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          用户申请信息<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="approval-type">审批类型:</label>
            <select
              id="approval-type"
              .value="${this.approvalType}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="用户注册">用户注册</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-type">用户类型:</label>
            <select
              id="user-type"
              .value="${this.userType}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="用户">用户</option>
            </select>
          </div>
          <div class="form-group">
            <label for="region">所属地区:</label>
            <select
              id="region"
              .value="${this.region}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="中卫">中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审核状态:</label>
            <select
              id="review-status"
              .value="${this.reviewStatus}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              ${this.getReviewStatusOptions().map(
                (option) => html`
                  <option value="${option.value}">${option.label}</option>
                `
              )}
            </select>
          </div>
          <button class="query-button" @click="${this.onQueryClick}">
            查询
          </button>
          <button class="clear-button" @click="${this.onClearClick}">
            清除
          </button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>用户名</th>
                <th>申请类型</th>
                <th>所属地区</th>
                <th>手机号</th>
                <th>用户类型</th>
                <th>申请时间</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredApplications.map(
                (application) => html`
                  <tr class="table-row">
                    <td>${application.username}</td>
                    <td>${application.applicationType}</td>
                    <td>${application.region}</td>
                    <td>${application.phone}</td>
                    <td>${application.userType}</td>
                    <td>${application.applicationDate}</td>
                    <td>
                      ${this.getReviewStatusInChinese(application.reviewStatus)}
                    </td>
                    <td>
                      <a
                        @click="${(e) => this.onViewClick(e, application)}"
                        data-mode="view"
                        >查看</a
                      >/
                      <a
                        @click="${(e) => this.onViewClick(e, application)}"
                        data-mode="review"
                        >审核</a
                      >
                    </td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  onInputChange(event) {
    const { id, value } = event.target;
    this[id] = value; // 更新对应绑定的属性
  }

  onViewClick(event, application) {
    const mode = event.target.getAttribute('data-mode');
    this.dispatchEvent(
      new CustomEvent('open-user-view', {
        detail: {
          mode,
          application,
        },
      })
    );
  }
}

customElements.define('audit-user-component', AuditUserComponent);
