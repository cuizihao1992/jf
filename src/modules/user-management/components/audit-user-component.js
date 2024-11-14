import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/audit-user.css?inline';

class AuditUserComponent extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

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
            <label for="location">审批类型:</label>
            <select id="location" style="background-color: gray;">
              <option>用户注册</option>
            </select>
          </div>
          <div class="form-group">
            <label for="device-type">用户类型:</label>
            <select id="device-type" style="background-color: gray;">
              <option>用户</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
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
              ${this.renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderRows() {
    const applications = [
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
      {
        id: 101,
        userName: '张三',
        applicationType: '添加',
        region: '中卫',
        phone: '13800138000',
        userType: '管理员',
        applicationTime: '2024-9-24 16:21:45',
        approveStatus: '已提交',
      },
    ];

    return applications.map(
      (application) => html`
      <tr class="table-row">
        <td>${application.userName}</a></td>
        <td>${application.applicationType}</td>
        <td>${application.region}</td>
        <td>${application.phone}</td>
        <td>${application.userType}</td>
        <td>${application.applicationTime}</td>
        <td>${application.approveStatus}</td>
        <td><a @click="${() => this.openUserView()}">查看</a>/<a 
       @click="${() => this.openUserReview()}">审核</a></td>
      </tr>
    `
    );
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
  openUserView() {
    this.dispatchEvent(new CustomEvent('open-user-view'));
  }
  openUserReview() {
    this.dispatchEvent(new CustomEvent('open-user-review'));
  }
}

customElements.define('audit-user-component', AuditUserComponent);
