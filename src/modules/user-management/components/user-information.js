import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-information.css?inline';

class UserInformation extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      mode: { type: String }, // 'view' 或 'edit'
      devices: { type: Array },
      allSelected: { type: Boolean },
      userData: { type: Object }
    };
  }

  constructor() {
    super();
    this.mode = 'view'; // 默认查看模式
    this.devices = [];
    this.allSelected = false;
    this.userData = {
      username: '',
      password: '',
      phone: '',
      userType: '用户',
      region: '中卫',
      status: '开放'
    };
  }

  // 处理全选
  handleSelectAll(e) {
    if (this.mode === 'view') return; // 查看模式下禁用选择
    this.allSelected = e.target.checked;
    const checkboxes = this.shadowRoot.querySelectorAll('.device-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = this.allSelected;
    });
  }

  // 渲染表单字段
  renderFormField(label, type, value, fieldName) {
    const isDisabled = this.mode === 'view';
    return html`
      <div class="form-group">
        <label>${label}:</label>
        ${type === 'select' 
          ? html`
              <select ?disabled=${isDisabled} @change=${e => this.handleInputChange(e, fieldName)}>
                <option>${value}</option>
              </select>
            `
          : html`
              <input 
                type=${type} 
                .value=${value} 
                placeholder="******"
                ?disabled=${isDisabled}
                @input=${e => this.handleInputChange(e, fieldName)}
              />
            `}
      </div>
    `;
  }

  handleInputChange(e, fieldName) {
    if (this.mode === 'view') return;
    this.userData = {
      ...this.userData,
      [fieldName]: e.target.value
    };
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>用户信息</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>

        <div class="section">
          <div class="section-title">注册信息</div>
          ${this.renderFormField('用户名', 'text', this.userData.username, 'username')}
          ${this.renderFormField('密码', 'password', this.userData.password, 'password')}
          ${this.renderFormField('手机号', 'text', this.userData.phone, 'phone')}
          ${this.renderFormField('用户类型', 'select', this.userData.userType, 'userType')}
          ${this.renderFormField('所属地区', 'select', this.userData.region, 'region')}
          ${this.renderFormField('用户状态', 'select', this.userData.status, 'status')}
        </div>

        <div class="section">
          <div class="section-title">用户权限</div>
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
                    />
                  </th>
                  <th>设备编号</th>
                  <th>所属地区</th>
                  <th>设备类型</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" class="device-checkbox" />
                  </td>
                  <td>101</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>102</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>103</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
                  <td>104</td>
                  <td>中卫</td>
                  <td>自动角反射器</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        ${this.mode === 'edit' 
          ? html`<button class="submit-button" @click=${this.handleSubmit}>确定</button>` 
          : ''}
      </div>
    `;
  }

  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }

  handleSubmit() {
    // 处理提交逻辑
    const selectedDevices = Array.from(this.shadowRoot.querySelectorAll('.device-checkbox:checked'))
      .map(checkbox => checkbox.closest('tr').querySelector('td:nth-child(2)').textContent);
    
    this.dispatchEvent(new CustomEvent('submit', {
      detail: {
        userData: this.userData,
        selectedDevices
      }
    }));
  }
}

customElements.define('user-information', UserInformation);
