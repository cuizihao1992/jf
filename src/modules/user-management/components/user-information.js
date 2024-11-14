import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-information.css?inline';

class UserInformation extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="container">
        <!-- Header section with close button -->
        <div class="header">
          <h1>用户信息</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>

        <!-- Registration Information Section -->
        <div class="section">
          <div class="section-title">注册信息</div>

          <!-- User information form fields -->
          <div class="form-group">
            <label>用户名:</label>
            <input type="text" placeholder="******" />
          </div>
          <div class="form-group">
            <label>密码:</label>
            <input type="password" placeholder="******" />
          </div>
          <div class="form-group">
            <label>手机号:</label>
            <input type="text" placeholder="******" />
          </div>
          <div class="form-group">
            <label>用户类型:</label>
            <select>
              <option>用户</option>
            </select>
          </div>
          <div class="form-group">
            <label>所属地区:</label>
            <select>
              <option>中卫</option>
            </select>
          </div>
          <div class="form-group">
            <label>用户状态:</label>
            <select>
              <option>开放</option>
            </select>
          </div>
        </div>
        <!-- User Permissions Section -->
        <div class="section">
          <h3>用户权限</h3>
          <h4>用户所属地区的设备使用权限：</h4>

          <div class="table-container">
            <table class="device-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>设备编号</th>
                  <th>所属地区</th>
                  <th>设备类型</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" class="device-checkbox" /></td>
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
        <!-- Submit button -->
        <button class="submit-button">确定</button>
      </div>
    `;
  }

  // Method to handle modal close
  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

// Register the custom element
customElements.define('user-information', UserInformation);
