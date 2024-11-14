import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/user-view.css?inline';

class UserView extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>用户申请</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>
          <div class="user-info">
            <h3>用户信息</h3>
            <div class="row">
              <label>用户名: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="admin"
              />
            </div>
            <div class="row">
              <label>密码: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="yz147258369"
              />
            </div>
            <div class="row">
              <label>手机号: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="13894417612"
              />
            </div>
            <div class="row">
              <label>申请日期: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="2024-10-9"
              />
            </div>
            <div class="row">
              <label>国家: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="中国"
              />
            </div>
            <div class="row">
              <label>所属地区: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="中卫"
              />
            </div>
            <div class="row">
              <label>用户类型: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="用户"
              />
            </div>
          </div>
          <div class="review-info">
            <div class="row">
              <label for="reviewer">审核人:</label>
              <input type="text" id="reviewer" />
            </div>
            <div class="row">
              <label for="review-time">审核时间:</label>
              <input type="text" id="review-time" />
            </div>
            <div class="row">
              <label for="review-opinion">审核意见:</label>
              <input type="text" id="review-opinion" />
            </div>
            <div class="row">
              <label for="notes">备注:</label>
              <textarea id="notes" placeholder=""></textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  handleClose() {
    // 这里可以添加关闭窗口的逻辑
    // 例如，隐藏组件或销毁组件
    this.remove();
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('user-view', UserView);
