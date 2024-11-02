import { LitElement, html, css } from 'lit';

class UserInformation extends LitElement {
  static styles = css`
    .container {
      width: 400px;
      padding: 15px;
      background-color: rgba(0, 9, 36, 0.8);
      color: white;
      font-family: Arial, sans-serif;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      border: 1px solid #1a2b4c; /* 添加整体边框 */
      height: 660px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .close-button {
      cursor: pointer;
      font-size: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 1px solid #58a6ff;
      padding-bottom: 10px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .form-group label {
      width: 100px;
      margin-right: 10px;
    }
    .form-group input,
    .form-group select {
      padding: 4px;
      border: 1px solid #333;
      border-radius: 5px;
      width: 150px;
      color: #000;
      text-align: center;
    }
    .section {
      border: 1px solid #58a6ff;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    h3 {
      margin: 10px 0;
      font-size: 18px;
      border-bottom: 1px solid #58a6ff;
      padding-bottom: 10px;
      margin-top: 0px;
    }
    h4 {
      margin: 1px 0;
      font-size: 16px;
    }
    .device-table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse;
      color: white;
    }
    .device-table th,
    .device-table td {
      padding: 8px;
      border: 1px solid #444;
      text-align: center;
    }
    .device-table th {
      background-color: #1a2b4c;
    }
    .device-checkbox {
      margin-right: 5px;
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;
      font-size: 14px;
      color: #aaa;
    }
    .submit-button {
      border: none;
      padding: 6px 14px;
      border-radius: 5px;
      cursor: pointer;
      align-self: flex-end;
      margin-top: 10px;
      margin-left: 320px;
    }
  `;

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
          
          <!-- Device permissions table -->
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
