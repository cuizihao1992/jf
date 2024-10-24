import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/device-log.js";
import "./components/task-log.js";

class LogManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String },  // 记录选中的按钮
    activeComponent: { type: String }, // 记录当前显示的组件
  };

  constructor() {
    super();
    this.selectedButton = "";   // 初始状态没有选中按钮
    this.activeComponent = "";  // 初始状态不显示任何组件
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="任务日志"
          ?selected=${this.selectedButton === 'taskLog'}
          @button-click=${() => this.setActiveComponent('taskLog')}
        ></custom-button>

        <custom-button
          label="设备日志"
          ?selected=${this.selectedButton === 'deviceLog'}
          @button-click=${() => this.setActiveComponent('deviceLog')}
        ></custom-button>
      </div>

      ${this.renderActiveComponent()}
    `;
  }

  setActiveComponent(componentName) {
    // 如果点击的按钮已经选中，取消选中并关闭组件
    if (this.activeComponent === componentName) {
      this.activeComponent = ""; // 关闭组件
      this.selectedButton = "";  // 清除选中状态
    } else {
      this.activeComponent = componentName; // 切换到新组件
      this.selectedButton = componentName;  // 设置当前选中的按钮
    }
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case "taskLog":
        return html`<task-log
          @close-modal=${this.closeTasks}
        ></task-log>`;  // 替换为实际的任务日志组件
      case "deviceLog":
        return html`<device-log
          @close-modal=${this.closeTasks}
        ></device-log>`;  // 替换为实际的设备日志组件
      default:
        return ""; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }
}

customElements.define("log-management", LogManagement);
