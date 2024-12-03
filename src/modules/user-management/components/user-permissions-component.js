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
    searchType: { type: String },
    searchCondition: { type: String },
    userType: { type: String },
    region: { type: String },
    userStatus: { type: String },
  };

  constructor() {
    super();
    this.showDialog = false;
    this.selectedUser = null;
    this.powerUsers = [];
    this.searchType = 'username';
    this.searchCondition = '';
    this.userType = '';
    this.region = '';
    this.userStatus = '';
    
    // 添加地区和用户类型映射对象
    this.regionToChineseMap = {
      'zhongwei': '中卫',
      'songshan': '嵩山'
    };
    
    this.userTypeToChineseMap = {
      'user': '用户',
      'admin': '管理员',
      'superAdmin': '超级管理员'
    };
    
    // 添加用户状态映射
    this.userStatusMap = {
      'active': '开放',
      'inactive': '禁用'
    };
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
      const params = {
        username: this.searchType === 'username' ? this.searchCondition : undefined,
        phone: this.searchType === 'phone' ? this.searchCondition : undefined,
        userId: this.searchType === 'userId' ? this.searchCondition : undefined,
        userType: this.userTypeToChineseMap[this.userType] || this.userType,
        region: this.regionToChineseMap[this.region] || this.region,
        status: this.userStatus,  // 使用英文状态值
      };
      
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const response = await api.userApi.query(params);
      if (Array.isArray(response)) {
        this.powerUsers = response.map(user => ({
          ...user,
          id: user.id || user.userId,
          status: user.status || 'active',
          userType: user.userType || user.user_type || '普通用户',
        }));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  handleUpdateSuccess() {
    console.log('Received update-success event');
    this.loadUsers(); // 重新加载用户数据
  }

  handleSearchTypeChange(event) {
    this.searchType = event.target.value;
    this.searchCondition = '';
  }

  handleSearchConditionChange(event) {
    this.searchCondition = event.target.value;
  }

  onInputChange(event) {
    const { id, value } = event.target;
    const propertyName = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[propertyName] = value;
    this.loadUsers();
  }

  onClearClick() {
    this.searchType = 'username';
    this.searchCondition = '';
    this.userType = '';
    this.region = '';
    this.userStatus = '';
    this.loadUsers();
  }

  render() {
    return html`
      <div class="modal">
        <div class="header">
          用户权限<button class="close-button" @click="${this.closeModal}">×</button>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="search-type">查询类型:</label>
            <select 
              id="search-type" 
              .value="${this.searchType}"
              @change="${this.handleSearchTypeChange}"
            >
              <option value="username">用户名</option>
              <option value="phone">手机号</option>
              <option value="userId">用户ID</option>
            </select>
          </div>
          <div class="search-condition-group">
            <label for="search-condition">查询条件:</label>
            <div class="input-with-buttons">
              <input
                type="text"
                id="search-condition"
                .value="${this.searchCondition}"
                @input="${this.handleSearchConditionChange}"
              />
              <button class="clear-button" @click="${this.onClearClick}">清除</button>
              <button class="query-button" @click="${this.loadUsers}">查询</button>
            </div>
          </div>
        </div>
        <hr />
        <div class="form-container">
          <div class="form-group">
            <label for="region">所属地区:</label>
            <select
              id="region"
              .value="${this.region}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="zhongwei">中卫</option>
              <option value="songshan">嵩山</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-type">用户类型:</label>
            <select
              id="userType"
              .value="${this.userType}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="user">用户</option>
              <option value="admin">管理员</option>
              <option value="superAdmin">超级管理员</option>
            </select>
          </div>
          <div class="form-group">
            <label for="user-status">用户状态:</label>
            <select
              id="userStatus"
              .value="${this.userStatus}"
              @change="${this.onInputChange}"
            >
              <option value="">全部</option>
              <option value="active">开放</option>
              <option value="inactive">禁用</option>
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
      <tr>
        <td>${user.username}</td>
        <td>${this.userTypeToChineseMap[user.userType] || user.userType}</td>
        <td>${user.createTime}</td>
        <td>${this.regionToChineseMap[user.region] || user.region}</td>
        <td>${this.userStatusMap[user.status] || user.status}</td>
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
