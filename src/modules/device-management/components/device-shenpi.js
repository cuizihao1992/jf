import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-shenpi.css?inline';

class deviceShenpi extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>设备审批</h1>
          <span class="close-button" @click="${this.handleClose}">×</span>
        </div>
        <div>
          <div class="user-info">
            <h3>设备信息</h3>
            <div class="row">
              <label>设备编号: </label>
              <input
                type="text"
                class="userInput"
                id="task-name"
                placeholder="中卫101"
              />
            </div>
            <div class="row">
              <label>所属地区: </label>
              <select class="userSelect" id="task-name">
                <option value="中卫">中卫</option>
              </select>
            </div>
            <div class="row">
              <label>设备类型: </label>
              <select class="userSelect" id="task-name">
                <option value="自动角反射器">自动角反射器</option>
              </select>
            </div>
            <div class="row">
              <label>偏磁角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>安装方向角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>安装俯仰角度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>设备所在纬度: </label>
              <input type="text" class="userInput" id="task-name" />
            </div>
            <div class="row">
              <label>设备所在经度: </label>
              <input type="text" class="userInput" id="task-name" />
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
            <button class="confirm-button" @click="${this.handleClose}">
              确定
            </button>
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

customElements.define('device-shenpi', deviceShenpi);
