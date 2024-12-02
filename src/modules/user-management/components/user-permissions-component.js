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

    window.addEventListener(
      'update-success',
      this.handleUpdateSuccess.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'update-success',
      this.handleUpdateSuccess.bind(this)
    );
  }

  async loadUsers() {
    try {
      const response = await api.userApi.query({});
      if (Array.isArray(response)) {
        // 确保每个用户对象都有必要的字段
        this.powerUsers = response.map(user => ({
          ...user,
          id: user.id || user.userId, // 确保有 id
          status: user.status || 'active', // 设置默认状态
          userType: user.userType || user.user_type || '普通用户', // 处理不同的字段名
        }));
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  handleUpdateSuccess() {
    console.log('Received update-success event');
    this.loadUsers(); // 重新加载用户数据
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
    if (!this.selectedUser) return '';
    
    const actionText = this.selectedUser.status === 'active' ? '禁用' : '开放';
    
    return html`
      <div class="confirm-dialog">
        <p>提示：是否${actionText}此用户？</p>
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
    if (!this.selectedUser) {
      console.warn('No user selected');
      return;
    }

    console.log('Updating user status for:', this.selectedUser);

    // 确保有用户ID
    if (!this.selectedUser.id) {
      console.error('User ID is missing');
      return;
    }

    try {
      const newStatus = this.selectedUser.status === 'active' ? 'inactive' : 'active';
      
      // 打印请求信息
      console.log('Sending update request:', {
        userId: this.selectedUser.id,
        newStatus: newStatus
      });

      // 更新后端用户状态
      const response = await api.userApi.update(this.selectedUser.id, {
        status: newStatus
      });

      if (response) {
        // 更新本地状态
        this.selectedUser.status = newStatus;
        
        // 刷新用户列表
        await this.loadUsers();
        
        // 关闭对话框
        this.showDialog = false;
        this.requestUpdate();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      // 可以添加错误提示
      alert('更新用户状态失败，请稍后重试');
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
    console.log('openUserInformation triggered with user:', user);
    
    // 统一数据结构
    const userData = {
        id: user.id || '',
        username: user.username || '',
        password: user.password || '',
        phone: user.phone || '',
        email: user.email || '',
        country: user.country || '中国',
        region: user.region || '',
        userType: user.userType || '',
        status: user.status || 'active',
        role: user.role || 'user',
        permissions: user.permissions || '',
        dataPermissions: user.dataPermissions || '',
        applicationType: user.applicationType || '注册',
        createTime: user.createTime || '',
        token: user.token || ''
    };

    console.log('Dispatching open-user-information with userData:', userData);
    
    this.dispatchEvent(
        new CustomEvent('open-user-information', {
            detail: { 
                mode,
                userData  // 确保使用 userData 作为属性名
            },
            bubbles: true,
            composed: true
        })
    );
  }
}

customElements.define('user-permissions-component', UserPermissionsComponent);
