import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js'; // Import the button component
import { sharedStyles } from '../../components/shared-styles.js'; // 引入共享样式
import './device-query.js'; // 引入设备查询弹窗组件

class DeviceControl extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 管理哪个按钮被选中
    isModalOpen: { type: Boolean } // 控制弹窗的显示状态
  };

  constructor() {
    super();
    this.selectedButton = ''; // 初始化为没有按钮被选中
    this.isModalOpen = false; // 弹窗初始为关闭状态
  }

  render() {
    return html`
      <custom-button
        label="设备查询"
        ?selected=${this.selectedButton === 'query'}
        @button-click=${() => this.toggleModal('query')}
      ></custom-button>
      <custom-button
        label="设备列表"
        ?selected=${this.selectedButton === 'list'}
        @button-click=${() => this.selectButton('list')}
      ></custom-button>

      <!-- 设备查询弹窗，根据 isModalOpen 条件渲染 -->
      ${this.isModalOpen
        ? html`<device-query @close-modal=${this.toggleModal}></device-query>`
        : ''}
    `;
  }

  // 切换设备查询弹窗的显示/隐藏状态
  toggleModal(buttonName) {
    if (this.selectedButton === buttonName) {
      // 如果再次点击同一个按钮，关闭弹窗并取消选中状态
      this.selectedButton = '';
      this.isModalOpen = false;
    } else {
      // 如果是第一次点击，打开弹窗并设置选中状态
      this.selectedButton = buttonName;
      this.isModalOpen = true;
    }
  }

  selectButton(buttonName) {
    this.selectedButton = buttonName; // 更新选中的按钮
  }
}

customElements.define('device-control', DeviceControl);
