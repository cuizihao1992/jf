import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-information.css?inline';
import api from '@/apis/api.js';

class UserInformation extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
    
    .form-input {
      background-color: rgba(20, 30, 50, 0.8);
      border: 1px solid rgb(45, 92, 136);
      border-radius: 3px;
      color: white;
      padding: 5px 8px;
      width: 200px;
    }

    .form-input.disabled {
      background-color: rgba(20, 30, 50, 0.5);
      cursor: not-allowed;
    }

    .submit-button {
      background-color: #2d5c88;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
    }

    .submit-button:disabled {
      background-color: #1a3550;
      cursor: not-allowed;
    }
  `;

  static get properties() {
    return {
      mode: { type: String },
      devices: { type: Array },
      allSelected: { type: Boolean },
      userData: { type: Object },
      isSubmitting: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.mode = 'view';
    this.devices = [];
    this.allSelected = false;
    this.isSubmitting = false;
    this.userData = {
      username: '',
      password: '',
      nick_name: '',
      phone: '',
      email: '',
      country: '中国',
      region: '',
      user_type: '',
      status: 'active',
      role: 'user',
      permissions: 'read,write',
      data_permissions: 'all',
      application_type: '注册',
      token: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadDevices();
  }

  async loadDevices() {
    try {
      if (!this.userData.username) {
        this.devices = [];
        return;
      }

      console.log('Loading devices for user:', this.userData.username);
      const response = await api.userDeviceApi.query({
        username: this.userData.username
      });
      
      if (!response) {
        throw new Error('No response from API');
      }

      this.devices = Array.isArray(response) ? response : [];
      console.log('Loaded devices:', this.devices);
      
      this.requestUpdate();
    } catch (error) {
      console.error('Failed to load devices:', error);
      this.devices = [];
      this.showMessage('加载设备列表失败: ' + error.message);
    }
  }

  setData(data) {
    if (!data || !data.userData) return;
    
    this.mode = data.mode;
    this.userData = {
      ...this.userData,
      ...data.userData
    };
    this.loadDevices();
    this.requestUpdate();
  }

  // 渲染表单字段
  renderFormField(label, type, value, fieldName) {
    const isDisabled = this.mode === 'view';
    const inputClasses = `form-input ${isDisabled ? 'disabled' : ''}`;
    
    return html`
      <div class="form-group">
        <label>${label}:</label>
        ${type === 'select' 
          ? html`
              <select 
                class="${inputClasses}"
                ?disabled=${isDisabled} 
                .value=${value}
                @change=${e => this.handleInputChange(e, fieldName)}
              >
                <option value="">请选择</option>
                ${this.getOptionsForField(fieldName)}
              </select>
            `
          : html`
              <input 
                class="${inputClasses}"
                type=${type} 
                .value=${value || ''} 
                ?disabled=${isDisabled}
                @input=${e => this.handleInputChange(e, fieldName)}
                placeholder="请输入${label}"
              />
            `}
      </div>
    `;
  }

  getOptionsForField(fieldName) {
    const options = {
      user_type: [
        { value: 'user', label: '普通用户' },
        { value: 'admin', label: '管理员' }
      ],
      status: [
        { value: 'active', label: '激活' },
        { value: 'inactive', label: '未激活' }
      ],
      role: [
        { value: 'user', label: '普通用户' },
        { value: 'admin', label: '管理员' }
      ],
      region: [
        { value: 'zhongwei', label: '中卫' },
        { value: 'other', label: '其他地区' }
      ]
    };

    return options[fieldName]?.map(option => html`
      <option value=${option.value} ?selected=${this.userData[fieldName] === option.value}>
        ${option.label}
      </option>
    `) || [];
  }

  handleInputChange(e, fieldName) {
    if (this.mode === 'view') return;
    
    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value
    };
  }

  render() {
    if (!this.userData || !this.userData.username) {
      return html`<div class="container">
        <div class="header">
          <h1>用户信息</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>加载中...</div>
      </div>`;
    }

    return html`
      <div class="container">
        <div class="header">
          <h1>用户信息</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>

        <div class="section">
          <div class="section-title">用户信息</div>
          ${this.renderFormField('用户名', 'text', this.userData.username, 'username')}
          ${this.mode === 'edit' ? this.renderFormField('密码', 'password', this.userData.password, 'password') : ''}
          ${this.renderFormField('手机号', 'text', this.userData.phone, 'phone')}
          ${this.renderFormField('用户类型', 'select', this.userData.user_type, 'user_type')}
          ${this.renderFormField('所属地区', 'select', this.userData.region, 'region')}
          ${this.renderFormField('状态', 'select', this.userData.status, 'status')}
        </div>

        <div class="section">
          <div class="section-title">设备权限</div>
          <h4>用户所属地区的设备使用权限：</h4>
          <div class="table-container">
            <table class="device-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      @change="${this.handleSelectAll}"
                      .checked="${this.allSelected}"
                      ?disabled="${this.mode === 'view'}"
                    />
                  </th>
                  <th>设备编号</th>
                  <th>所属地区</th>
                  <th>设备类型</th>
                </tr>
              </thead>
              <tbody>
                ${this.devices.map(device => html`
                  <tr>
                    <td>
                      <input 
                        type="checkbox" 
                        class="device-checkbox"
                        .checked="${device.selected}"
                        ?disabled="${this.mode === 'view'}"
                        @change="${e => this.handleDeviceSelect(e, device)}"
                      />
                    </td>
                    <td>${device.device_id}</td>
                    <td>${device.region}</td>
                    <td>${device.device_type}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>

        ${this.mode === 'edit' 
          ? html`
            <div class="button-group">
              <button 
                class="submit-button" 
                @click=${this.handleSubmit}
                ?disabled=${this.isSubmitting}
              >
                ${this.isSubmitting ? '保存中...' : '保存'}
              </button>
              <button 
                class="button cancel-button" 
                @click=${this.handleClose}
              >
                取消
              </button>
            </div>
          ` 
          : html`
            <div class="button-group">
              <button 
                class="button cancel-button" 
                @click=${this.handleClose}
              >
                关闭
              </button>
            </div>
          `}
      </div>
    `;
  }

  handleDeviceSelect(e, device) {
    device.selected = e.target.checked;
    this.requestUpdate();
  }

  async handleSubmit() {
    try {
      if (!this.userData.username) {
        throw new Error('用户名不能为空');
      }

      this.isSubmitting = true;
      
      // 获取选中的设备ID列表
      const selectedDevices = this.devices
        .filter(device => device.selected)
        .map(device => device.device_id);

      // 准备更新数据
      const updateData = {
        username: this.userData.username,
        nick_name: this.userData.nick_name || '',
        phone: this.userData.phone || '',
        email: this.userData.email || '',
        user_type: this.userData.user_type || '',
        region: this.userData.region || '',
        status: this.userData.status || 'active',
        role: this.userData.role || 'user',
        permissions: this.userData.permissions || '',
        data_permissions: this.userData.data_permissions || '',
        devices: selectedDevices
      };

      // 如果修改了密码，则添加密码字段
      if (this.userData.password) {
        updateData.password = this.userData.password;
      }

      console.log('正在更新用户数据:', updateData);
      
      const response = await api.userApi.update(this.userData.username, updateData);
      
      if (!response || response.error) {
        throw new Error(response?.error || '更新失败');
      }

      // 发送刷新列表事件
      this.dispatchEvent(new CustomEvent('updateData', {
        bubbles: true,
        composed: true
      }));

      window.showToast({ 
        message: '用户信息更新成功！', 
        type: 'success', 
        duration: 3000 
      });

      this.handleClose();
    } catch (error) {
      console.error('更新失败:', error);
      window.showToast({ 
        message: `更新失败: ${error.message}`, 
        type: 'error', 
        duration: 3000 
      });
    } finally {
      this.isSubmitting = false;
      this.requestUpdate();
    }
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  handleSelectAll(e) {
    if (this.mode === 'view') return;
    this.allSelected = e.target.checked;
    this.devices = this.devices.map(device => ({
      ...device,
      selected: this.allSelected
    }));
    this.requestUpdate();
  }

  showMessage(message) {
    this.dispatchEvent(new CustomEvent('show-message', {
      detail: { message },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('user-information', UserInformation);
