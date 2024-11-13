import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../../components/shared-styles.js'; // 引入共享样式
import './components/device-log.js';
import './components/task-log.js';
import '@/modules/task-management/components/task-details.js'; // 引入任务详情组件
import '@/modules/task-management/components/Fault-details.js'; // 引入故障详情组件
import '@/modules/task-management/components/task-log-component.js'; // 引入日志详情组件

class LogManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String }, // 记录选中的按钮
    activeComponent: { type: String }, // 记录当前显示的组件
    isTaskDetailsOpen: { type: Boolean },
    isFaultDetailsOpen: { type: Boolean },
    isTaskLogOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.selectedButton = ''; // 初始状态没有选中按钮
    this.activeComponent = ''; // 初始状态不显示任何组件
    this.isTaskDetailsOpen = false;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false;
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
      <div class="panel">${this.renderActiveComponent()}
      <div style="position:absolute;top:0;left:100%;">
        <!-- 任务详情弹窗 -->
        ${this.isTaskDetailsOpen
          ? html`<task-details
              @close-modal=${this.closeTaskDetails}
            ></task-details>`
          : ''}

        <!-- 故障详情弹窗 -->
        ${this.isFaultDetailsOpen
          ? html`<fault-details
              @close-modal=${this.closeFaultDetails}
            ></fault-details>`
          : ''}

        <!-- 设备日志弹窗 -->
        ${this.isTaskLogOpen
          ? html`<task-log-component
              @close-modal=${this.closeTaskLog}
            ></task-log-component>`
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
      this.selectedButton = componentName; // 设置当前选中的按钮
      this.isTaskDetailsOpen = false;
      this.isFaultDetailsOpen = false;
      this.isTaskLogOpen = false;
    }
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case 'taskLog':
        return html`<task-log
          @close-modal=${this.closeTasks}
          @open-task-details=${this.openTaskDetails}
          @open-fault-details=${this.openFaultDetails}
          @open-task-log-component=${this.openTaskLog}
        ></task-log>`; // 替换为实际的任务日志组件
      case 'deviceLog':
        return html`<device-log @close-modal=${this.closeTasks}></device-log>`; // 替换为实际的设备日志组件
      default:
        return ''; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ''; // 隐藏当前组件
    this.selectedButton = ''; // 清除选中状态
  }
  openTaskDetails() {
    this.isTaskDetailsOpen = true;
    this.isFaultDetailsOpen = false;
    this.isTaskLogOpen = false;
  }

  openFaultDetails() {
    this.isFaultDetailsOpen = true;
    this.isTaskDetailsOpen = false;
    this.isTaskLogOpen = false;
  }

  openTaskLog() {
    this.isTaskLogOpen = true; // 打开设备日志弹窗
    this.isTaskDetailsOpen = false;
    this.isFaultDetailsOpen = false;
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
}

customElements.define('log-management', LogManagement);
