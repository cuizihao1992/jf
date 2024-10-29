import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/device-query.js"; // 引入设备查询弹窗组件
import "./components/posture-adjust.js"; // 引入姿态调整组件
import "./components/realtime-imagery.js"; // 引入姿态调整组件
import "./components/angle-detection.js"; // 引入角度检测组件
import "./components/single-device-log.js"; // 引入设备日志组件
import "./components/device-list.js"; 
import "@/modules/task-management/components/parameter-config.js";// 引入姿态计算组件

class DeviceControl extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 管理哪个按钮被选中
    isModalOpen: { type: Boolean }, // 控制设备查询弹窗的显示状态
    isPostureAdjustModalOpen: { type: Boolean }, // 控制姿态调整弹窗的显示状态
    isRealtimeImageryOpen: { type: Boolean }, // 控制实时图像弹窗的显示状态
    isAngleDetectionOpen: { type: Boolean }, // 控制角度检测弹窗的显示状态
    isSingleDeviceLogOpen: { type: Boolean }, // 控制设备日志弹窗的显示状态
    isParameterConfigOpen: { type: Boolean }, // 控制姿态计算弹窗的显示状态
  };

  constructor() {
    super();
    this.selectedButton = ""; // 初始化为没有按钮被选中
    this.isModalOpen = false; // 设备查询弹窗初始为关闭状态
    this.isPostureAdjustModalOpen = false; // 姿态调整弹窗初始为关闭状态
    this.isRealtimeImageryOpen = false; // 实时图像弹窗初始为关闭状态
    this.isAngleDetectionOpen = false; // 角度检测弹窗初始为关闭状态
    this.isSingleDeviceLogOpen = false; // 设备日志弹窗初始为关闭状态
    this.isParameterConfigOpen = false; // 姿态计算弹窗初始为关闭状态
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="设备查询"
          ?selected=${this.selectedButton === "query"}
          @button-click=${() => this.toggleModal("query")}
        ></custom-button>
        <custom-button
          label="设备列表"
          ?selected=${this.selectedButton === "list"}
          @button-click=${() => this.selectButton("list")}
        ></custom-button>
      </div>
      <!-- 设备查询弹窗，根据 isModalOpen 条件渲染 -->
      <div class="panel">
        ${this.isModalOpen
        ? html` <device-query
              ?showactions=${true}
              @close-modal=${this.closeModal}
              @open-posture-adjust=${this.openPostureAdjustModal}
            >
            </device-query>`
        : ""}

        <!-- 姿态调整弹窗，根据 isPostureModalOpen 条件渲染 -->
        ${this.isPostureAdjustModalOpen
        ? html`<posture-adjust
              @close-modal=${this.closePostureAdjustModal}
              @open-realtime-imagery=${this.openRealtimeImagery}
              @open-angle-detection=${this.openAngleDetection}
              @open-single-device-log=${this.openSingleDeviceLog}
              @open-parameter-config=${this.openParameterConfig}
            ></posture-adjust>`
        : ""}
        <!-- 实时图像弹窗，根据 isRealtimeImageryOpen 条件渲染 -->
        ${this.isRealtimeImageryOpen
        ? html`<realtime-imagery
              @close-modal=${this.closeRealtimeImagery}
            ></ realtime-imagery>`
        : ""}
        <!-- 角度检测弹窗，根据 isAngleDetectionOpen 条件渲染 -->
        ${this.isAngleDetectionOpen
        ? html`<angle-detection
              @close-modal=${this.closeAngleDetection}
            ></ angle-detection>`
        : ""}
        <!-- 设备日志弹窗，根据 isSingleDeviceLogOpen 条件渲染 -->
        ${this.isSingleDeviceLogOpen
        ? html`<single-device-log
              @close-modal=${this.closeSingleDeviceLog}
            ></ single-device-log>`
        : ""}
        ${this.isParameterConfigOpen
        ? html`<parameter-config
              @close-modal=${this.closeParameterConfig}
            ></ parameter-config>`
        : ""}
        ${this.selectedButton === "list" ? html`<device-list></device-list>` : ""}
      </div>
    `;
  }

  // 切换设备查询弹窗的显示/隐藏状态
  toggleModal(buttonName) {
    if (this.selectedButton === buttonName) {
      this.selectedButton = "";
      this.isModalOpen = !this.isModalOpen;
    } else {
      this.selectedButton = buttonName;
      this.isModalOpen = true;
    }
  }

  // 打开姿态调整弹窗
  openPostureAdjustModal() {
    this.isPostureAdjustModalOpen = true;
  }
  // 打开实时图像弹窗
  openRealtimeImagery() {
    this.isRealtimeImageryOpen = true;
  }
  // 打开角度检测弹窗
  openAngleDetection() {
    this.isAngleDetectionOpen = true;
  }
  // 打开设备日志弹窗
  openSingleDeviceLog() {
    this.isSingleDeviceLogOpen = true;
  }
  // 打开姿态计算弹窗
  openParameterConfig() {
    this.isParameterConfigOpen = true;
  }

  // 关闭姿态计算弹窗
  closeParameterConfig() {
    this.isParameterConfigOpen = false;
  }

  // 关闭角度检测弹窗
  closeAngleDetection() {
    this.isAngleDetectionOpen = false;
  }
  // 关闭设备日志弹窗
  closeSingleDeviceLog() {
    this.isSingleDeviceLogOpen = false;
  }

  // 关闭姿态调整弹窗
  closePostureAdjustModal() {
    this.isPostureAdjustModalOpen = false;
  }
  // 关闭实时图像弹窗
  closeRealtimeImagery() {
    this.isRealtimeImageryOpen = false;

  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectButton(buttonName) {
    this.selectedButton = buttonName; // 更新选中的按钮
  }
}

customElements.define("device-control", DeviceControl);
