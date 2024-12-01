import { LitElement, html, css, unsafeCSS } from 'lit';
import api from '@/apis/api';
import styles from './login-page.css?inline';

class LoginPage extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      captchaImg: { type: String },
      uuid: { type: String },
      isRegisterModalVisible: { type: Boolean },
      isForgotPasswordModalVisible: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.isRegisterModalVisible = false;
    this.isForgotPasswordModalVisible = false;
  }

  render() {
    return html`
      <div class="login-container">
        <div class="image-container"></div>
        <div class="login-box">
          ${this.isRegisterModalVisible
            ? this.renderRegisterModal()
            : this.isForgotPasswordModalVisible
              ? this.renderForgotPasswordModal()
              : this.renderLoginModal()}
        </div>
      </div>
    `;
  }
  renderLoginModal() {
    return html`<h2>系统账号登录</h2>
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
          value="123456"
        />
      </div>
      <div class="role-group">
        <label>
          <input type="radio" name="role" value="user" checked /> 用户
        </label>
        <label> <input type="radio" name="role" value="admin" /> 管理员 </label>
        <label>
          <input type="radio" name="role" value="superadmin" />
          超级管理员
        </label>
      </div>
      <button class="login-btn" @click=${this.login}>登录</button>
      <div class="link-group">
        <a href="#" @click=${this.showRegisterModal}>注册</a> |
        <a href="#" @click=${this.showForgotPasswordModal}>忘记密码</a>
      </div>`;
  }
  renderRegisterModal() {
    return html`
      <div class="modal">
        <h2>用户注册</h2>
        <div class="form-group">
          <label for="register-phone">手机号</label>
          <input
            type="text"
            id="register-phone"
            name="phone"
            placeholder="请输入手机号"
          />
        </div>
        <div class="form-group">
          <label for="register-username">用户名</label>
          <input
            type="text"
            id="register-username"
            name="username"
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label for="register-password">密码</label>
          <input
            type="password"
            id="register-password"
            name="password"
            placeholder="请输入密码"
          />
        </div>
        <div class="form-group">
          <label for="register-confirm-password">确认密码</label>
          <input
            type="password"
            id="register-confirm-password"
            name="confirm-password"
            placeholder="请确认密码"
          />
        </div>
        <button @click=${this.submitRegister}>提交</button>
        <button @click=${this.closeRegisterModal}>关闭</button>
      </div>
    `;
  }

  renderForgotPasswordModal() {
    return html`
      <div class="modal">
        <h2>忘记密码</h2>
        <div class="form-group">
          <label for="forgot-phone">手机号</label>
          <input
            type="text"
            id="forgot-phone"
            name="phone"
            placeholder="请输入手机号"
          />
        </div>
        <div class="form-group">
          <label for="forgot-username">用户名</label>
          <input
            type="text"
            id="forgot-username"
            name="username"
            placeholder="请输入用户名"
          />
        </div>
        <div class="form-group">
          <label for="new-password">新密码</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            placeholder="请输入新密码"
          />
        </div>
        <div class="form-group">
          <label for="confirm-new-password">确认新密码</label>
          <input
            type="password"
            id="confirm-new-password"
            name="confirm-new-password"
            placeholder="请确认新密码"
          />
        </div>
        <button @click=${this.submitForgotPassword}>提交</button>
        <button @click=${this.closeForgotPasswordModal}>关闭</button>
      </div>
    `;
  }

  showRegisterModal() {
    this.isForgotPasswordModalVisible = false;
    this.isRegisterModalVisible = true;
  }

  closeRegisterModal() {
    this.isRegisterModalVisible = false;
  }

  showForgotPasswordModal() {
    this.isRegisterModalVisible = false;
    this.isForgotPasswordModalVisible = true;
  }

  closeForgotPasswordModal() {
    this.isForgotPasswordModalVisible = false;
  }

  async login() {
    try {
      const username = this.shadowRoot.querySelector('#username').value;
      const password = this.shadowRoot.querySelector('#password').value;

      if (!username || !password) {
        this.showError('请填写完整的登录信息');
        return;
      }
      const res = await api.loginApi.login({ username, password });
      const message = res.message;
      console.log(message);
      localStorage.setItem('token', `Bearer ${res.token}`);
      window.dispatchEvent(new CustomEvent('login-success'));
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      return;
    } catch (error) {
      console.error('登录请求出错:', error);
      this.showError('登录失败，请稍后重试');
    }
  }

  async submitRegister() {
    try {
      const phone = this.shadowRoot.querySelector('#register-phone').value;
      const username =
        this.shadowRoot.querySelector('#register-username').value;
      const password =
        this.shadowRoot.querySelector('#register-password').value;
      const confirmPassword = this.shadowRoot.querySelector(
        '#register-confirm-password'
      ).value;

      if (!phone || !username || !password || !confirmPassword) {
        this.showError('请填写完整的注册信息');
        return;
      }
      if (password !== confirmPassword) {
        this.showError('密码和确认密码不匹配');
        return;
      }

      const applicationDate = new Date().toISOString().split('T')[0];
      const registrationTime = new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);
      const country = '中国';
      const userType = 'user';
      const applicationType = 'registration';

      const res = await api.userReviewApi.add({
        phone,
        username,
        password,
        country,
        application_date: applicationDate,
        registration_time: registrationTime,
        user_type: userType,
        application_type: applicationType,
      });

      console.log('注册成功:', res);
      this.closeRegisterModal();
    } catch (error) {
      console.error('注册请求出错:', error);
      this.showError('注册失败，请稍后重试');
    }
  }

  async submitForgotPassword() {
    // Handle forgot password logic here
  }

  // 添加错误提示方法
  showError(message) {
    const errorDiv =
      this.shadowRoot.querySelector('.error-message') ||
      (() => {
        const div = document.createElement('div');
        div.className = 'error-message';
        this.shadowRoot
          .querySelector('.login-box')
          .insertBefore(div, this.shadowRoot.querySelector('.login-btn'));
        return div;
      })();

    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.marginBottom = '10px';
    errorDiv.style.textAlign = 'center';
  }
}

customElements.define('login-page', LoginPage);
