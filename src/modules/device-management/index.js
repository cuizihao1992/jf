import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/device-add.js";
import "./components/device-approve.js"; // 假设有创建任务组件
import "./components/device-edit.js"; // 假设有任务查询组件
import "./components/device-search.js"; // 假设有任务审核组件
import "@/modules/device-control/components/device-query.js";

class DeviceManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 记录选中的按钮
    activeComponent: { type: String }, // 记录当前显示的组件
  };

  constructor() {
    super();
    this.selectedButton = ""; // 初始状态没有选中按钮
    this.activeComponent = ""; // 初始状态不显示任何组件
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="新增设备"
          ?selected=${this.selectedButton === "addDevice"}
          @button-click=${() => this.setActiveComponent("addDevice")}
        ></custom-button>

        <custom-button
          label="设备查询"
          ?selected=${this.selectedButton === "queryDevice"}
          @button-click=${() => this.setActiveComponent("queryDevice")}
        ></custom-button>

        <custom-button
          label="设备编辑"
          ?selected=${this.selectedButton === "editDevice"}
          @button-click=${() => this.setActiveComponent("editDevice")}
        ></custom-button>

        <custom-button
          label="设备审批"
          ?selected=${this.selectedButton === "approveDevice"}
          @button-click=${() => this.setActiveComponent("approveDevice")}
        ></custom-button>
      </div>

      ${this.renderActiveComponent()}
      <div class="panel">

      </div>
    `;
  }

  setActiveComponent(componentName) {
    // 如果点击的按钮已经选中，取消选中并关闭组件
    if (this.activeComponent === componentName) {
      this.activeComponent = ""; // 关闭组件
      this.selectedButton = ""; // 清除选中状态
    } else {
      this.activeComponent = componentName; // 切换到新组件
      this.selectedButton = componentName; // 设置当前选中的按钮
    }
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case "addDevice":
        return html`<device-add
          @close-modal=${this.closeTasks}
        ></device-add>`;  
      case "queryDevice":
        return html`<device-search
          @close-modal=${this.closeTasks}
        ></device-search>`;  
      case "editDevice":
        return html`<device-edit
          @close-modal=${this.closeTasks}
        ></device-edit>`;  
      case "approveDevice":
        return html`<device-approve
          @close-modal=${this.closeTasks}
        ></device-approve>`;  
      default:
        return ""; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }
}

customElements.define("device-management", DeviceManagement);
