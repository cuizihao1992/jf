import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

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
      background-image: url('/satellite-image.png'); /* 替换为实际路径 */
      background-size: cover;
      background-position: center;
    }
    .image-container {
      width: 60%;
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

    .error-message {
      color: red;
      margin-bottom: 10px;
      text-align: center;
      font-size: 14px;
    }
  `;

  static get properties() {
    return {
      captchaImg: { type: String },
      uuid: { type: String },
    };
  }
  constructor() {
    super();
    this.getCaptcha();
  }

  render() {
    return html`
      <div class="login-container">
        <div class="image-container"></div>
        <div class="login-box">
          <h2>系统账号登录</h2>
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="请输入用户名"
              value="admin"
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="请输入密码"
              value="admin123"
            />
          </div>
          <div class="form-group">
            <label for="captcha">验证码</label>
            <input
              type="text"
              id="captcha"
              name="captcha"
              placeholder="请输入验证码"
            />
            <!-- 使用 data:image/png;base64,${this.captchaImg} 自动更新图片 -->
            <img
              src="data:image/png;base64,${this.captchaImg}"
              alt="验证码"
              @click="${this.getCaptcha}"
              style="cursor: pointer;"
            />
          </div>
          <div class="role-group">
            <label
              ><input type="radio" name="role" value="user" checked />
              用户</label
            >
            <label
              ><input type="radio" name="role" value="admin" /> 管理员</label
            >
            <label
              ><input type="radio" name="role" value="superadmin" />
              超级管理员</label
            >
          </div>
          <button class="login-btn" @click=${this.login}>登录</button>
          <div class="link-group">
            <a href="#">注册</a> | <a href="#">忘记密码</a>
          </div>
        </div>
      </div>
    `;
  }

  async getCaptcha() {
    try {
      // 添加错误重试逻辑
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await fetch(
            'http://fk3510tn3811.vicp.fun/jf-prod-api/captchaImage',
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              // 添加这些选项以处理跨域请求
              mode: 'cors',
              credentials: 'include'
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.code === 200) {
            this.captchaImg = data.img;
            this.uuid = data.uuid;
            return; // 成功获取验证码，退出重试循环
          } else {
            console.warn('获取验证码返回非200状态:', data.msg);
          }
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
        }
      }
    } catch (error) {
      console.error('验证码请求出错:', error);
      // 显示错误提示给用户
      this.showError('获取验证码失败，请刷新页面重试');
    }
  }

  async login() {
    try {
      const username = this.shadowRoot.querySelector('#username').value;
      const password = this.shadowRoot.querySelector('#password').value;
      const code = this.shadowRoot.querySelector('#captcha').value;

      if (!username || !password || !code) {
        this.showError('请填写完整的登录信息');
        return;
      }

      const response = await fetch(
        'http://fk3510tn3811.vicp.fun/jf-prod-api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'isToken': 'false',
            'repeatSubmit': 'false'
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            username,
            password,
            code,
            uuid: this.uuid
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code === 200 && data.token) {
        console.log('登录成功:', data);

        // 修改 token 存储方式，添加 "Bearer" 前缀
        localStorage.setItem('token', `Bearer ${data.token}`);

        // 触发登录成功事件
        window.dispatchEvent(new CustomEvent('login-success'));

        // 延迟跳转
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } else {
        this.showError(data.msg || '登录失败');
        this.getCaptcha();
      }
    } catch (error) {
      console.error('登录请求出错:', error);
      this.showError('登录失败，请稍后重试');
      this.getCaptcha();
    }
  }

  // 添加错误提示方法
  showError(message) {
    // 可以添加一个错误提示元素到 DOM 中
    const errorDiv = this.shadowRoot.querySelector('.error-message') || 
      (() => {
        const div = document.createElement('div');
        div.className = 'error-message';
        this.shadowRoot.querySelector('.login-box').insertBefore(
          div,
          this.shadowRoot.querySelector('.login-btn')
        );
        return div;
      })();
    
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginBottom = '10px';
    errorDiv.style.textAlign = 'center';
  }
}

customElements.define('login-page', LoginPage);
