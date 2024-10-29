import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/task-info-component.js";
import "./components/task-create-component.js"; // 假设有创建任务组件
import "./components/task-query-component.js"; // 假设有任务查询组件
import "./components/task-review-component.js"; // 假设有任务审核组件
import "./components/Fault-details.js"; // 引入故障详情组件
import "./components/task-details.js"; // 引入任务详情组件
import "./components/task-log-component.js"; 
import "./components/task-review-detail.js"; 
import "./components/task-review-review.js"; 
import "./components/Status-Mission.js"; // 引入任务状态组件
import "./components/Scope-selection.js"; // 引入范围选择组件
import "./components/parameter-config.js"; // 引入范围选择组件
class TaskManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    activeComponent: { type: String }, // 通过字符串控制当前显示的组件
    selectedButton: { type: String }, // 添加状态属性用于记录选中的按钮
    isTaskDetailsOpen: { type: Boolean },
    isFaultDetailsOpen: { type: Boolean },
    isTaskLogOpen: { type: Boolean },
    isTaskReviewDetailOpen: { type: Boolean },
    isTaskReviewReviewOpen: { type: Boolean },
    isStatusMissionOpen: { type: Boolean },
    isScopeSelectionOpen: { type: Boolean },
    isParameterConfigOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.activeComponent = ""; // 初始状态不显示任何组件
    this.selectedButton = ""; // 初始状态没有选中的按钮
    this.isTaskDetailsOpen = false;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false;
    this.isTaskReviewDetailOpen = false;
    this.isTaskReviewReviewOpen = false;
    this.isTaskReviewReviewOpen = false;
    this.isStatusMissionOpen = false;
    this.isScopeSelectionOpen = false;
    this.isParameterConfigOpen = false;
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="新建任务"
          ?selected=${this.selectedButton === "createTask"}
          @button-click=${() => this.setActiveComponent("createTask")}
        ></custom-button>

        <custom-button
          label="我的任务"
          ?selected=${this.selectedButton === "myTasks"}
          @button-click=${() => this.setActiveComponent("myTasks")}
        ></custom-button>

        <custom-button
          label="任务查询"
          ?selected=${this.selectedButton === "queryTasks"}
          @button-click=${() => this.setActiveComponent("queryTasks")}
        ></custom-button>

        <custom-button
          label="任务审核"
          ?selected=${this.selectedButton === "reviewTasks"}
          @button-click=${() => this.setActiveComponent("reviewTasks")}
        ></custom-button>
      </div>
      ${this.renderActiveComponent()}
      <!-- 任务详情弹窗 -->
      ${this.isTaskDetailsOpen
        ? html`<task-details @close-modal=${this.closeTaskDetails}></task-details>`
        : ""}

      <!-- 故障详情弹窗 -->
      ${this.isFaultDetailsOpen
        ? html`<fault-details-component @close-modal=${this.closeFaultDetails}></fault-details-component>`
        : ""}

      <!-- 设备日志弹窗 -->
      ${this.isTaskLogOpen
        ? html`<task-log-component @close-modal=${this.closeTaskLog}></task-log-component>`
        : ""}
      <!-- 任务审核详情弹窗 -->
      ${this.isTaskReviewDetailOpen
        ? html`<task-review-detail @close-modal=${this.closeTaskReviewDetail}></task-review-detail>`
        : ""}
        ${this.isTaskReviewReviewOpen
          ? html`<task-review-review @close-modal=${this.closeTaskReviewReview}></task-review-review>`
          : ""}
    <!-- 任务状态弹窗 -->
      ${this.isStatusMissionOpen
        ? html`<status-mission @close-modal=${this.closeStatusMission}></status-mission>`
        : ""}
      <!-- 范围选择弹窗 -->
      ${this.isScopeSelectionOpen
        ? html`<scope-selection @close-modal=${this.closeScopeSelection}></scope-selection>`
        : ""}
      ${this.isParameterConfigOpen
        ? html`<parameter-config @close-modal=${this.closeParameterConfig}></parameter-config>`
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
      this.selectedButton = componentName; 
        this.isTaskDetailsOpen = false;
        this.isFaultDetailsOpen = false;
        this.isTaskLogOpen = false;
         this.isTaskReviewDetailOpen = false;
         this.isTaskReviewReviewOpen = false;  // 设置当前选中的按钮
    }
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case "createTask":
        return html`<task-create-component
         @open-status-mission=${this.openStatusMission}
         @open-scope-selection=${this.openScopeSelection}
         @open-parameter-config=${this.openParameterConfig}></task-create-component>`;
      case "myTasks":
        return html`<task-info-component
          @close-modal=${this.closeTasks}
           @open-task-details=${this.openTaskDetails}
           @open-task-details=${this.openTaskDetails}
        ></task-info-component>`;
      case "queryTasks":
        return html`<task-query-component
          @close-modal=${this.closeTasks}
          @open-task-details=${this.openTaskDetails}
          @open-fault-details=${this.openFaultDetails}
          @open-task-log-component=${this.openTaskLog}
        ></task-query-component>`;
      case "reviewTasks":
        return html`<task-review-component
          @close-modal=${this.closeTasks}
          @open-task-review-detail=${this.openTaskReviewDetail}
          @open-task-review-review=${this.openTaskReviewReview}
        ></task-review-component>`;
      default:
        return ""; // 不显示任何组件
    }
  }

  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }

  openTaskDetails() {
    this.isTaskDetailsOpen = true;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false// 打开故障详情弹窗
     // 打开任务详情弹窗
    //this.activeComponent = "taskDetails"; // 设置为任务详情组件
  }

  openFaultDetails() {
    this.isFaultDetailsOpen = true;
    this.isTaskDetailsOpen = false;
    this.isTaskLogOpen = false// 打开故障详情弹窗
    //this.activeComponent = "faultDetails"; // 设置为故障详情组件
  }

  openTaskLog() {
    this.isTaskLogOpen = true; // 打开设备日志弹窗
    this.isTaskDetailsOpen = false;
    this.isFaultDetailsOpen = false;
    //this.activeComponent = "taskLog"; // 设置为设备日志组件
  }
  openTaskReviewDetail() {
    this.isTaskReviewDetailOpen = true;
    this.isTaskReviewReviewOpen = false; // 打开设备日志弹窗
    //this.activeComponent = "taskReviewDetail"; // 设置为设备日志组件
  }
  openTaskReviewReview() {
    this.isTaskReviewReviewOpen = true;
    this.isTaskReviewDetailOpen = false; // 打开设备日志弹窗
    //this.activeComponent = "taskReviewDetail"; // 设置为设备日志组件
  }
  openRevokeConfirmation() {
    this.isRevokeConfirmationOpen = true;
    this.isTaskDetailsOpen = false;
  }
  openStatusMission() {
    this.isStatusMissionOpen = true; // 打开设备日志弹窗
  }
  openScopeSelection() {
    this.isScopeSelectionOpen = true; // 打开设备日志弹窗
  }
  openParameterConfig() {
    this.isParameterConfigOpen = true; // 打开设备日志弹窗
  }
  closeRevokeConfirmation() {
    this.isRevokeConfirmationOpen = false;}
    
  closeTaskDetails() {
    this.isTaskDetailsOpen = false;
  }

  closeFaultDetails() {
    this.isFaultDetailsOpen = false;
  }

  closeTaskLog() {
    this.isTaskLogOpen = false;
  }
  closeTaskReviewDetail() {
    this.isTaskReviewDetailOpen = false;
  }
  closeTaskReviewReview() {
    this.isTaskReviewReviewOpen = false; 
    //this.activeComponent = "taskReviewDetail"; // 设置为设备日志组件
  }
  closeStatusMission() {
    this.isStatusMissionOpen = false;
  }
  closeScopeSelection() {
    this.isScopeSelectionOpen = false;
  }
  closeParameterConfig() {
    this.isParameterConfigOpen = false;
  }
}

customElements.define("task-management", TaskManagement);
