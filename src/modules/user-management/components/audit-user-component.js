import { LitElement, html, css } from 'lit';

class AuditUserComponent extends LitElement {
  static styles = css`
    .modal {
      padding: 20px;
      background: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      width: 770px;
      height: 610px; 
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

    .status-online { background-color: green; }
    .status-warning { background-color: orange; }
    .status-offline { background-color: red; }

    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
          .table-container {
      max-height: 530px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }
  `;

  render() {
    return html`
      <div class="modal">
        <div class="header">用户申请信息<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
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
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
      { id: 101, userName: '张三', applicationType: '添加', region: '中卫', phone: '13800138000', userType: '管理员', applicationTime: '2024-9-24 16:21:45', approveStatus: '已提交' },
    ];

    return applications.map(application => html`
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
    `);
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
