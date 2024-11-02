import { LitElement, html, css } from 'lit';

class UserPermissionsComponent extends LitElement {
  static styles = css`
    /* 样式代码保持不变 */
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
    /* 弹窗样式 */
    .confirm-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      color: black;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 10;
      text-align: center;
      font-size: 16px;
      width: 260px;
    }
    .dialog-button {
      padding: 5px 15px;
      margin: 10px 5px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    .confirm-button {
      background-color: #58a6ff;
      color: white;
    }
    .cancel-button {
      background-color: #ccc;
      color: black;
    }
    a {
      color: #1e90ff;
      cursor: pointer;
      text-decoration: none;
    }
    .table-container {
      max-height: 475px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
    }      
  `;

  static properties = {
    showDialog: { type: Boolean },
    selectedUserStatus: { type: String }
  };

  constructor() {
    super();
    this.showDialog = false;
    this.selectedUserStatus = '开放'; // 初始状态为开放
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">用户权限<button class="close-button" @click="${this.closeModal}">×</button></div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-condition">用户名:</label>
            <input type="text" id="search-condition" style="background-color: white;" />
          </div>
          <button class="query-button">查询</button>
        </div><hr />
        <div class="form-container">
          <div class="form-group">
            <label for="location">所属地区:</label>
            <select id="location" style="background-color: gray;">
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-type">用户类型:</label>
            <select id="user-type" style="background-color: gray;">
              <option>管理员</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-status">用户状态:</label>
            <select id="user-status" style="background-color: gray;">
              <option>开放</option>
            </select>
          </div>
        </div>
            <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>用户名</th>
              <th>用户类型</th>
              <th>注册时间</th>
              <th>所属地区</th>
              <th>用户状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderRows()}
          </tbody>
        </table>
      </div>
      </div>
      ${this.showDialog ? this.renderConfirmDialog() : ''}
    `;
  }

  renderRows() {
    const powerUsers = [
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
      { userName: '张三', userType: '管理员', registerTime: '2024-9-24 16:21:45', region: '中卫', userStatus: this.selectedUserStatus },
    ];

    return powerUsers.map(powerUser => html`
      <tr class="table-row">
        <td>${powerUser.userName}</td>
        <td>${powerUser.userType}</td>
        <td>${powerUser.registerTime}</td>
        <td>${powerUser.region}</td>
        <td>${powerUser.userStatus}</td>
        <td>
          <a @click="${() => this.openViewInformation()}">查看</a> /
          <a @click="${() => this.openUserInformation()}">编辑</a> /
          <a @click="${() => this.toggleUserStatus()}">${powerUser.userStatus === '开放' ? '禁用' : '开放'}</a>
        </td>
      </tr>
    `);
  }

  toggleUserStatus() {
    this.showDialog = true;
  }

  renderConfirmDialog() {
    return html`
      <div class="confirm-dialog">
        <p>提示：是否${this.selectedUserStatus === '开放' ? '禁用' : '开放'}此用户？</p>
        <button class="dialog-button confirm-button" @click="${this.confirmToggleStatus}">确定</button>
        <button class="dialog-button cancel-button" @click="${this.cancelToggleStatus}">取消</button>
      </div>
    `;
  }

  confirmToggleStatus() {
    // 切换用户状态
    this.selectedUserStatus = this.selectedUserStatus === '开放' ? '禁用' : '开放';
    this.showDialog = false;
    this.requestUpdate();
  }

  cancelToggleStatus() {
    this.showDialog = false;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openUserInformation() {
    this.dispatchEvent(new CustomEvent('open-user-information'));
  }
  openViewInformation() {
    this.dispatchEvent(new CustomEvent('open-view-information'));
  }
}

customElements.define('user-permissions-component', UserPermissionsComponent);
