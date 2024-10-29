import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/device-add.js";
import "./components/device-approve.js"; // 假设有创建任务组件
import "./components/device-edit.js"; // 假设有任务查询组件
import "./components/device-xiangqing.js"; // 假设有任务查询组件
import "./components/device-xiangqing1.js"; // 假设有任务查询组件
import "./components/device-review.js"; // 假设有任务查询组件
import "./components/device-shenpi.js"; // 假设有任务查询组件


class DeviceManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 记录选中的按钮
    activeComponent: { type: String }, 
    isDevicexiangqingOpen: { type: Boolean },
    isDevicexiangqingOpen1: { type: Boolean },
    isDeviceReviewOpen: { type: Boolean },
    isDeviceShenpiOpen: { type: Boolean }, // 记录当前显示的组件
  };

  constructor() {
    super();
    this.selectedButton = ""; // 初始状态没有选中按钮
    this.activeComponent = "";
    this.isTaskDetailsOpen = false; // 初始状态不显示任何组件
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
       ${this.isDevicexiangqingOpen
        ? html`<device-xiangqing @close-modal=${this.closeDevicexiangqing}></device-xiangqing>`
        : ""}
        ${this.isDevicexiangqingOpen1
          ? html`<device-xiangqing1 @close-modal=${this.closeDevicexiangqing1}></device-xiangqing1>`
          : ""}
          ${this.isDeviceReviewOpen
            ? html`<device-review @close-modal=${this.closeDeviceReview}></device-review>`
            : ""}
            ${this.isDeviceShenpiOpen
              ? html`<device-shenpi @close-modal=${this.closeDeviceShenpi}></device-shenpi>`
              : ""}
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
        return html`<device-query
          @close-modal=${this.closeTasks}
        ></device-query>`;
      case "editDevice":
        return html`<device-edit
          @close-modal=${this.closeTasks}
          @open-device-xiangqing=${this.openDevicexiangqing}
          @open-device-xiangqing1=${this.openDevicexiangqing1}
        ></device-edit>`;
      case "approveDevice":
        return html`<device-approve
          @close-modal=${this.closeTasks}
          @open-device-review=${this.openDevicereview}
          @open-device-shenpi=${this.openDeviceshenpi}
        ></device-approve>`;
      default:
        return ""; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }
  openDevicexiangqing() {
    this.isDevicexiangqingOpen = true;
    //this.isFaultDetailsOpen = false;
    //this.isTaskLogOpen = false// 打开故障详情弹窗
     // 打开任务详情弹窗
    //this.activeComponent = "taskDetails"; // 设置为任务详情组件
  }
  closeDevicexiangqing() {
    this.isDevicexiangqingOpen = false;}
    openDevicexiangqing1() {
      this.isDevicexiangqingOpen1 = true;
      //this.isFaultDetailsOpen = false;
      //this.isTaskLogOpen = false// 打开故障详情弹窗
       // 打开任务详情弹窗
      //this.activeComponent = "taskDetails"; // 设置为任务详情组件
    }
    closeDevicexiangqing1() {
      this.isDevicexiangqingOpen1 = false;}
      openDevicereview() {
        this.isDeviceReviewOpen = true;
        //this.isFaultDetailsOpen = false;
        //this.isTaskLogOpen = false// 打开故障详情弹窗
         // 打开任务详情弹窗
        //this.activeComponent = "taskDetails"; // 设置为任务详情组件
      }
      closeDeviceReview() {
        this.isDeviceReviewOpen = false;}
        openDeviceshenpi() {
          this.isDeviceShenpiOpen = true;
          //this.isFaultDetailsOpen = false;
          //this.isTaskLogOpen = false// 打开故障详情弹窗
           // 打开任务详情弹窗
          //this.activeComponent = "taskDetails"; // 设置为任务详情组件
        }
        closeDeviceShenpi() {
          this.isDeviceShenpiOpen = false;}
}

customElements.define("device-management", DeviceManagement);
