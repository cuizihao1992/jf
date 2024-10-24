import { LitElement, html } from "lit";
import "@/components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "@/components/shared-styles.js"; // 引入共享样式
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
        <device-query
          ?showactions=${false}
          @close-modal=${this.closeModal}
          @open-posture-adjust=${this.openPostureAdjustModal}
        >
        </device-query>
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
        return html`<div>新增设备组件内容</div>`; // 替换为实际的新增设备组件
      case "queryDevice":
        return html`<div>设备查询组件内容</div>`; // 替换为实际的设备查询组件
      case "editDevice":
        return html`<div>设备编辑组件内容</div>`; // 替换为实际的设备编辑组件
      case "approveDevice":
        return html`<div>设备审批组件内容</div>`; // 替换为实际的设备审批组件
      default:
        return ""; // 不显示任何组件
    }
  }
}

customElements.define("device-management", DeviceManagement);
