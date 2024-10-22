import { LitElement, html, css } from 'lit';

class LoginPage extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }
    
    .login-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100vh;
      background-color: #f0f2f5;
    }

    .image-container {
      width: 60%;
      background-image: url('/path/to/your/satellite-image.jpg'); /* 替换为实际路径 */
      background-size: cover;
      background-position: center;
    }

    .login-box {
      width: 40%;
      padding: 40px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      margin-right: 5%;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group input {
      width: 100%;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .role-group {
      margin-bottom: 20px;
    }

    .role-group label {
      margin-right: 20px;
      font-weight: normal;
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }

    .login-btn:hover {
      background-color: #0056b3;
    }

    .link-group {
      text-align: center;
      margin-top: 10px;
    }

    .link-group a {
      margin: 0 10px;
      color: #007bff;
      text-decoration: none;
    }

    .link-group a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div class="login-container">
        <div class="image-container"></div>
        <div class="login-box">
          <h2>系统账号登录</h2>
          <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" name="username" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" name="password" placeholder="请输入密码">
          </div>
          <div class="role-group">
            <label><input type="radio" name="role" value="user"> 用户</label>
            <label><input type="radio" name="role" value="admin"> 管理员</label>
            <label><input type="radio" name="role" value="superadmin"> 超级管理员</label>
          </div>
          <button class="login-btn" @click=${this.login}>登录</button>
          <div class="link-group">
            <a href="#">注册</a> | <a href="#">忘记密码</a>
          </div>
        </div>
      </div>
    `;
  }

  login() {
    const username = this.shadowRoot.querySelector('#username').value;
    const password = this.shadowRoot.querySelector('#password').value;
    const role = this.shadowRoot.querySelector('input[name="role"]:checked').value;

    console.log('登录信息:', { username, password, role });

    // 处理登录逻辑，比如调用 API 验证登录信息
  }
}

customElements.define('login-page', LoginPage);
