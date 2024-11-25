import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/audit-user.css?inline';
import api from '@/apis/api.js';

class AuditUserComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    applications: { type: Array }, // 定义应用状态数据
  };

  constructor() {
    super();
    this.applications = []; // 初始化为空数组
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadApplications(); // 加载数据
  }

  async loadApplications() {
    try {
      this.applications = await api.userReviewApi.query({});
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
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
            <select id="approval-type" style="background-color: gray;">
              <option>用户注册</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-type">用户类型:</label>
            <select id="user-type" style="background-color: gray;">
              <option>用户</option>
            </select>
          </div>
          <div class="form-group">
            <label for="region">所属地区:</label>
            <select id="region" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review-status">审核状态:</label>
            <select id="review-status" style="background-color: gray;">
              <option>已提交</option>
            </select>
          </div>
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
              ${this.applications.map(
                (application) => html`
                  <tr class="table-row">
                    <td>${application.username}</td>
                    <td>${application.applicationType}</td>
                    <td>${application.region}</td>
                    <td>${application.phone}</td>
                    <td>${application.userType}</td>
                    <td>${application.applicationDate}</td>
                    <td>${application.reviewStatus}</td>
                    <td>
                      <a @click="${this.onViewClick}" data-mode="view">查看</a>/
                      <a @click="${this.onViewClick}" data-mode="review"
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

  onViewClick(event) {
    const mode = event.target.getAttribute('data-mode'); // 获取 mode 属性
    this.dispatchEvent(
      new CustomEvent('open-user-view', {
        detail: { mode },
      })
    );
  }
}

customElements.define('audit-user-component', AuditUserComponent);
