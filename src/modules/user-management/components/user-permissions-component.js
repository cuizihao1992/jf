import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-permissions.css?inline';

class UserPermissionsComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    showDialog: { type: Boolean },
    selectedUserStatus: { type: String },
  };

  constructor() {
    super();
    this.showDialog = false;
    this.selectedUserStatus = '开放'; // 初始状态为开放
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          用户权限<button class="close-button" @click="${this.closeModal}">
            ×
          </button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-condition">用户名:</label>
            <input
              type="text"
              id="search-condition"
              style="background-color: white;"
            />
          </div>
          <button class="query-button">查询</button>
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
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
      {
        userName: '张三',
        userType: '管理员',
        registerTime: '2024-9-24 16:21:45',
        region: '中卫',
        userStatus: this.selectedUserStatus,
      },
    ];

    return powerUsers.map(
      (powerUser) => html`
        <tr class="table-row">
          <td>${powerUser.userName}</td>
          <td>${powerUser.userType}</td>
          <td>${powerUser.registerTime}</td>
          <td>${powerUser.region}</td>
          <td>${powerUser.userStatus}</td>
          <td>
            <a @click="${() => this.openUserInformation('view')}">查看</a> /
            <a @click="${() => this.openUserInformation('edit')}">编辑</a> /
            <a @click="${() => this.toggleUserStatus()}"
              >${powerUser.userStatus === '开放' ? '禁用' : '开放'}</a
            >
          </td>
        </tr>
      `
    );
  }

  toggleUserStatus() {
    this.showDialog = true;
  }

  renderConfirmDialog() {
    return html`
      <div class="confirm-dialog">
        <p>
          提示：是否${this.selectedUserStatus === '开放'
            ? '禁用'
            : '开放'}此用户？
        </p>
        <button
          class="dialog-button confirm-button"
          @click="${this.confirmToggleStatus}"
        >
          确定
        </button>
        <button
          class="dialog-button cancel-button"
          @click="${this.cancelToggleStatus}"
        >
          取消
        </button>
      </div>
    `;
  }

  confirmToggleStatus() {
    // 切换用户状态
    this.selectedUserStatus =
      this.selectedUserStatus === '开放' ? '禁用' : '开放';
    this.showDialog = false;
    this.requestUpdate();
  }

  cancelToggleStatus() {
    this.showDialog = false;
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openUserInformation(mode) {
    this.dispatchEvent(new CustomEvent('open-user-information', {
      detail: { mode }
    }));
  }
}

customElements.define('user-permissions-component', UserPermissionsComponent);
