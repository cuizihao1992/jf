import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-permissions.css?inline';
import api from '@/apis/api.js';

class UserPermissionsComponent extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    showDialog: { type: Boolean },
    selectedUser: { type: Object },
    powerUsers: { type: Array },
  };

  constructor() {
    super();
    this.showDialog = false;
    this.selectedUser = null;
    this.powerUsers = []; // 初始化为空数组
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadUsers(); // 加载用户数据
  }

  async loadUsers() {
    try {
      this.powerUsers = await api.userApi.query({});
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
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
            <label for="region">所属地区:</label>
            <select id="region" style="background-color: gray;">
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
              ${this.powerUsers.map((user) => this.renderRow(user))}
            </tbody>
          </table>
        </div>
      </div>
      ${this.showDialog ? this.renderConfirmDialog() : ''}
    `;
  }

  renderRow(user) {
    return html`
      <tr class="table-row">
        <td>${user.username}</td>
        <td>${user.userType}</td>
        <td>${user.createTime}</td>
        <td>${user.region}</td>
        <td>${user.status}</td>
        <td>
          <a @click="${() => this.openUserInformation(user, 'view')}">查看</a> /
          <a @click="${() => this.openUserInformation(user, 'edit')}">编辑</a> /
          <a @click="${() => this.openConfirmDialog(user)}">
            ${user.status === 'active' ? '禁用' : '开放'}
          </a>
        </td>
      </tr>
    `;
  }

  openConfirmDialog(user) {
    this.selectedUser = user; // 设置当前选中用户
    this.showDialog = true;
  }

  renderConfirmDialog() {
    return html`
      <div class="confirm-dialog">
        <p>
          提示：是否
          ${this.selectedUser.userStatus === '开放' ? '禁用' : '开放'} 此用户？
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

  async confirmToggleStatus() {
    if (!this.selectedUser) return;

    try {
      // 更新后端用户状态
      await api.userApi.update(this.selectedUser.id, {
        userStatus: this.selectedUser.userStatus === '开放' ? '禁用' : '开放',
      });

      // 更新本地状态
      this.selectedUser.userStatus =
        this.selectedUser.userStatus === '开放' ? '禁用' : '开放';

      this.showDialog = false;
      this.requestUpdate();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  }

  cancelToggleStatus() {
    this.showDialog = false;
    this.selectedUser = null; // 重置选中用户
  }

  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  openUserInformation(user, mode) {
    const userData = {
      username: user.username || '',
      password: user.password || '',
      nick_name: user.nick_name || '',
      phone: user.phone || '',
      email: user.email || '',
      country: user.country || '中国',
      region: user.region || '',
      user_type: user.user_type || '',
      status: user.status || 'active',
      role: user.role || 'user',
      permissions: user.permissions || 'read,write',
      data_permissions: user.data_permissions || 'all',
      application_type: user.application_type || '注册',
      token: user.token || ''
    };

    this.dispatchEvent(
      new CustomEvent('open-user-information', {
        detail: { 
          mode,
          userData  // 传递完整的用户数据
        }
      })
    );
  }
}

customElements.define('user-permissions-component', UserPermissionsComponent);
