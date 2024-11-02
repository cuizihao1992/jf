import { LitElement, html, css } from 'lit';

class ViewInformation extends LitElement {
  static styles = css`
    .container {
      position: absolute;
      left: calc(40% + 60px);
      top: 14%;
      width: 340px;
      padding: 15px;
      background-color: rgba(0, 9, 36, 0.8);
      color: white;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      height: 625px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
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
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      border-bottom: 1px solid #58a6ff;
      padding-bottom: 5px;
    }
    .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .form-group label {
      width: 100px;
      margin-right: 10px;
      font-size: 14px;
    }
    .form-group input {
      border: 1px solid #333;
      width: 150px;
      color: #000;
      text-align: center;
      margin-left:-35px;
      height: 24px;
      border-radius: 5px;
    }
    .form-group select{
      border: 1px solid #333;
      width: 155px;
      color: #000;
      text-align: center;
      margin-left:-35px;
      height: 27px;
      border-radius: 5px;
    }
    .section {
      border: 1px solid #58a6ff;
      padding: 5px;
      margin-bottom: 9px;
      border-radius: 5px;
     
    }
    h3 {
      margin: 10px 0;
      font-size: 20px;
      border-bottom: 1px solid #58a6ff;
      padding-bottom: 5px;
      margin-top: 0px;
    }
    h4 {
      margin: 1px 0;
      font-size: 16px;
    }

    .device-table {
      width: 100%;
      border-collapse: collapse;
      color: white;
    }
    .device-table th,
    .device-table td {
      padding: 8px;
      border: 1px solid #444;
      text-align: center;
      font-size: 14px;
    }
    .device-table th {
      background-color: #1a2b4c;
      font-size: 14px;
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
      width: 45px;
      height: 30px;
      align-self: end;
      border-radius: 4px;
      color: black;
      font-size: 14px;
      margin-top: -8px;
    }

    .table-container {
      max-height: 200px; /* 限制表格的最大高度 */
      overflow-y: auto; /* 仅表格内容滚动 */
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
    `;
  }

  // Method to handle modal close
  handleClose() {
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}


// Register the custom element
customElements.define('view-information', ViewInformation);
