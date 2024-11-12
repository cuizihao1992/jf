import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../../components/shared-styles.js'; // 引入共享样式
import './components/task-info-component.js';
import './components/task-create-component.js'; // 假设有创建任务组件
import './components/task-query-component.js'; // 假设有任务查询组件
import './components/task-review-component.js'; // 假设有任务审核组件
import './components/Fault-details.js'; // 引入故障详情组件
import './components/task-details.js'; // 引入任务详情组件
import './components/task-log-component.js';
import './components/task-review-detail.js';
import './components/task-review-review.js';
import './components/Status-Mission.js'; // 引入任务状态组件
import './components/Scope-selection.js'; // 引入范围选择组件
import './components/parameter-config.js'; // 引入范围选择组件
import './components/task-edit.js';
class TaskManagement extends LitElement {
  static styles = [sharedStyles];
  static properties = {
    activeComponent: { type: String }, // 通过字符串控制当前显示的组件
    selectedButton: { type: String }, // 添加状态属性用于记录选中的按钮
    isTaskDetailsOpen: { type: Boolean },
    leftPanel: { type: Boolean },
    isFaultDetailsOpen: { type: Boolean },
    isTaskLogOpen: { type: Boolean },
    isTaskReviewDetailOpen: { type: Boolean },
    isTaskReviewReviewOpen: { type: Boolean },
    isStatusMissionOpen: { type: Boolean },
    isScopeSelectionOpen: { type: Boolean },
    isParameterConfigOpen: { type: Boolean },
    isTaskEditOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.activeComponent = ''; // 初始状态不显示任何组件
    this.selectedButton = ''; // 初始状态没有选中的按钮
    this.isTaskDetailsOpen = false;
    this.leftPanel = true;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false;
    this.isTaskReviewDetailOpen = false;
    this.isTaskReviewReviewOpen = false;
    this.isTaskReviewReviewOpen = false;
    this.isStatusMissionOpen = false;
    this.isScopeSelectionOpen = false;
    this.isParameterConfigOpen = false;
    this.isTaskEditOpen = false;
    this.currentTask = {};
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="新建任务"
          ?selected=${this.selectedButton === 'createTask'}
          @button-click=${() => this.setActiveComponent('createTask')}
        ></custom-button>

        <custom-button
          label="我的任务"
          ?selected=${this.selectedButton === 'myTasks'}
          @button-click=${() => this.setActiveComponent('myTasks')}
        ></custom-button>

        <custom-button
          label="任务查询"
          ?selected=${this.selectedButton === 'queryTasks'}
          @button-click=${() => this.setActiveComponent('queryTasks')}
        ></custom-button>

        <custom-button
          label="任务审核"
          ?selected=${this.selectedButton === 'reviewTasks'}
          @button-click=${() => this.setActiveComponent('reviewTasks')}
        ></custom-button>
      </div>

      <div class="panel">
        ${this.leftPanel ? this.renderActiveComponent() : ''}
      </div>

      <div class="panel-right">
        ${this.isTaskDetailsOpen
          ? html`<task-details
              .data=${this.currentTask}
              @updateData=${this.updateData}
              @close-modal=${this.closeTaskDetails}
            ></task-details>`
          : ''}
        ${this.isFaultDetailsOpen
          ? html`<fault-details
              @close-modal=${this.closeFaultDetails}
            ></fault-details>`
          : ''}
        ${this.isTaskLogOpen
          ? html`<task-log-component
              @close-modal=${this.closeTaskLog}
            ></task-log-component>`
          : ''}
        ${this.isTaskReviewDetailOpen
          ? html`<task-review-detail
              @close-modal=${this.closeTaskReviewDetail}
            ></task-review-detail>`
          : ''}
        ${this.isTaskReviewReviewOpen
          ? html`<task-review-review
              @close-modal=${this.closeTaskReviewReview}
            ></task-review-review>`
          : ''}
        ${this.isStatusMissionOpen
          ? html`<status-mission
              @close-modal=${this.closeStatusMission}
            ></status-mission>`
          : ''}
        ${this.isScopeSelectionOpen
          ? html`<scope-selection
              @close-modal=${this.closeScopeSelection}
            ></scope-selection>`
          : ''}
        ${this.isParameterConfigOpen
          ? html`<parameter-config
              @close-modal=${this.closeParameterConfig}
            ></parameter-config>`
          : ''}
        ${this.isTaskEditOpen
          ? html`<task-edit @close-modal=${this.closeTaskEdit}></task-edit>`
          : ''}
      </div>
    `;
  }

  setActiveComponent(componentName) {
    // 如果点击的按钮已经选中，取消选中并关闭组件
    if (this.activeComponent === componentName) {
      this.activeComponent = ''; // 关闭组件
      this.selectedButton = ''; // 清除选中状态
    } else {
      this.activeComponent = componentName; // 切换到新组件
      this.selectedButton = componentName;
      this.isTaskDetailsOpen = false;
      this.isFaultDetailsOpen = false;
      this.isTaskLogOpen = false;
      this.isTaskReviewDetailOpen = false;
      this.isTaskReviewReviewOpen = false;
      this.isTaskEditOpen = false;
      this.isStatusMissionOpen = false;
      this.isScopeSelectionOpen = false; // 设置当前选中的按钮
      this.isParameterConfigOpen = false;
    }
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case 'createTask':
        return html`<task-create-component
          @open-status-mission=${this.openStatusMission}
          @open-scope-selection=${this.openScopeSelection}
          @open-parameter-config=${this.openParameterConfig}
        ></task-create-component>`;
      case 'myTasks':
        return html`<task-info-component
          @close-modal=${this.closeTasks}
          @open-task-details=${this.openTaskDetails}
        ></task-info-component>`;
      case 'queryTasks':
        return html`<task-query-component
          @close-modal=${this.closeTasks}
          @open-task-details=${this.openTaskDetails}
          @open-fault-details=${this.openFaultDetails}
          @open-task-log-component=${this.openTaskLog}
        ></task-query-component>`;
      case 'reviewTasks':
        return html`<task-review-component
          @close-modal=${this.closeTasks}
          @open-task-review-detail=${this.openTaskReviewDetail}
          @open-task-review-review=${this.openTaskReviewReview}
        ></task-review-component>`;
      default:
        return ''; // 不显示任何组件
    }
  }

  closeTasks() {
    this.activeComponent = ''; // 隐藏当前组件
    this.selectedButton = ''; // 清除选中状态
  }

  updateData(event) {
    this.requestUpdate();
    this.leftPanel = false;
    setTimeout(() => {
      this.leftPanel = true;
    }, 0); // 使用微小的延时来确保状态更新
  }
  openTaskDetails(event) {
    this.isTaskDetailsOpen = true;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false;
    this.isTaskEditOpen = false;
    this.currentTask = event.detail;
    console.log('接收到的任务详情:', event.detail);
  }

  openFaultDetails() {
    this.isFaultDetailsOpen = true;
    this.isTaskDetailsOpen = false;
    this.isTaskLogOpen = false; // 打开故障详情弹窗
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
  openTaskEdit() {
    this.isTaskEditOpen = true;
    this.isTaskDetailsOpen = false; // 打开设备日志弹窗
  }
  closeTaskEdit() {
    this.isTaskEditOpen = false; // 打开设备日志弹窗
  }
  openStatusMission() {
    this.isStatusMissionOpen = true;
    this.isScopeSelectionOpen = false;
    this.isParameterConfigOpen = false;
  }
  openScopeSelection() {
    this.isScopeSelectionOpen = true;
    this.isParameterConfigOpen = false;
    this.isStatusMissionOpen = false;
  }
  openParameterConfig() {
    this.isParameterConfigOpen = true;
    this.isScopeSelectionOpen = false;
    this.isStatusMissionOpen = false; // 打开设备日志弹窗
  }
  closeRevokeConfirmation() {
    this.isRevokeConfirmationOpen = false;
  }

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

customElements.define('task-management', TaskManagement);
