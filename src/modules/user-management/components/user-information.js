import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-information.css?inline';
import api from '@/apis/api';

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
    };
  }

  constructor() {
    super();
    this.mode = 'view';
    this.devices = [];
    this.allSelected = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchDevices();
  }

  async fetchDevices() {
    try {
      const data = await api.devicesAllApi.query({});
      if (data && Array.isArray(data)) {
        this.devices = data;
        this.initializeDeviceSelection();
      } else {
        console.error('获取设备数据失败:', data.message);
      }
    } catch (error) {
      console.error('设备接口调用失败:', error);
    }
  }

  initializeDeviceSelection() {
    // 如果 dataPermissions 包含 "ALL"，则全选
    if (this.userData.dataPermissions === 'ALL') {
      this.allSelected = true;
      this.devices.forEach((device) => {
        device.selected = true;
      });
    } else {
      // 否则根据 dataPermissions 勾选
      const permissions = this.userData.dataPermissions.split(',');
      this.devices.forEach((device) => {
        device.selected = permissions.includes(String(device.id));
      });
    }
    this.requestUpdate(); // 手动触发更新
  }

  handleSelectAll(e) {
    if (this.mode === 'view') return;
    this.allSelected = e.target.checked;
    this.devices.forEach((device) => (device.selected = this.allSelected));
    this.requestUpdate(); // 手动触发更新
  }

  getOptionsForField(fieldName) {
    const options = {
      user_type: [
        { value: 'user', label: '普通用户' },
        { value: 'admin', label: '管理员' },
      ],
      status: [
        { value: 'active', label: '激活' },
        { value: 'inactive', label: '未激活' },
      ],
      role: [
        { value: 'user', label: '普通用户' },
        { value: 'admin', label: '管理员' },
      ],
      region: [
        { value: 'zhongwei', label: '中卫' },
        { value: 'other', label: '其他地区' },
      ],
    };

    return (
      options[fieldName]?.map(
        (option) => html`
          <option
            value=${option.value}
            ?selected=${this.userData[fieldName] === option.value}
          >
            ${option.label}
          </option>
        `
      ) || []
    );
  }

  handleInputChange(e, fieldName) {
    if (this.mode === 'view') return;

    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value,
    };
  }

  async handleSubmit() {
    const selectedDevices = this.devices
      .filter((device) => device.selected)
      .map((device) => device.id);

    if (selectedDevices.length === 0) {
      alert('请至少选择一个设备权限！');
      return;
    }

    const updatedData = {
      ...this.userData,
      dataPermissions: selectedDevices.includes('All')
        ? 'All'
        : selectedDevices.join(','),
    };

    try {
      const response = await api.userApi.update(
        updatedData.userId,
        updatedData
      );
      if (response) {
        // alert('用户信息更新成功！');
        this.dispatchEvent(
          new CustomEvent('update-success', { bubbles: true, composed: true })
        );
        this.handleClose();
      } else {
        alert('更新失败，请稍后重试！');
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      alert('更新用户信息时出错，请检查网络连接或稍后重试。');
    }
  }

  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  renderFormField(label, type, value, fieldName, options = []) {
    const isDisabled = this.mode === 'view';
    return html`
      <div class="form-group">
        <label>${label}:</label>
        ${type === 'select'
          ? html`
              <select
                ?disabled=${isDisabled}
                @change=${(e) => this.handleInputChange(e, fieldName)}
              >
                ${options.map(
                  (option) =>
                    html`<option
                      value=${option.value}
                      ?selected=${value === option.value}
                    >
                      ${option.label}
                    </option>`
                )}
              </select>
            `
          : html`
              <input
                type=${type}
                .value=${value}
                placeholder="******"
                ?disabled=${isDisabled}
                @input=${(e) => this.handleInputChange(e, fieldName)}
              />
            `}
      </div>
    `;
  }

  render() {
    const statusOptions = [
      { value: 'active', label: '活跃' },
      { value: 'inactive', label: '非活跃' },
      { value: 'banned', label: '禁止' },
    ];

    const regionOptions = [
      { value: '登封', label: '登封' },
      { value: '中卫', label: '中卫' },
    ];

    const userTypeOptions = [
      { value: '普通用户', label: '普通用户' },
      { value: '管理员', label: '管理员' },
      { value: '超级管理员', label: '超级管理员' },
    ];

    return html`
      <div class="container">
        <div class="header">
          <h1>用户信息</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>

        <div class="section">
          <div class="section-title">注册信息</div>
          ${this.renderFormField(
            '用户名',
            'text',
            this.userData.username,
            'username'
          )}
          ${this.renderFormField(
            '密码',
            'password',
            this.userData.password,
            'password'
          )}
          ${this.renderFormField(
            '手机号',
            'text',
            this.userData.phone,
            'phone'
          )}
          ${this.renderFormField(
            '用户类型',
            'select',
            this.userData.userType,
            'userType',
            userTypeOptions
          )}
          ${this.renderFormField(
            '所属地区',
            'select',
            this.userData.region,
            'region',
            regionOptions
          )}
          ${this.renderFormField(
            '用户状态',
            'select',
            this.userData.status,
            'status',
            statusOptions
          )}
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
                ${this.devices.map(
                  (device) => html`
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          class="device-checkbox"
                          .checked="${device.selected}"
                          @change="${(e) =>
                            (device.selected = e.target.checked)}"
                        />
                      </td>
                      <td>${device.id}</td>
                      <td>${device.region}</td>
                      <td>${device.type}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>

        ${this.mode === 'edit'
          ? html`<button class="submit-button" @click=${this.handleSubmit}>
              确定
            </button>`
          : ''}
      </div>
    `;
  }
}

customElements.define('user-information', UserInformation);
