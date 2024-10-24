import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/task-info-component.js";
import "./components/task-create-component.js"; // 假设有创建任务组件
import "./components/task-query-component.js"; // 假设有任务查询组件
import "./components/task-review-component.js"; // 假设有任务审核组件

class TaskManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    activeComponent: { type: String }, // 通过字符串控制当前显示的组件
    selectedButton: { type: String }, // 添加状态属性用于记录选中的按钮
  };

  constructor() {
    super();
    this.activeComponent = ""; // 初始状态不显示任何组件
    this.selectedButton = ""; // 初始状态没有选中的按钮
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
      <div class="panel">
      ${this.renderActiveComponent()}
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
      case "createTask":
        return html`<task-create-component></task-create-component>`;
      case "myTasks":
        return html`<task-info-component
          @close-modal=${this.closeTasks}
        ></task-info-component>`;
      case "queryTasks":
        return html`<task-query-component
          @close-modal=${this.closeTasks}
        ></task-query-component>`;
      case "reviewTasks":
        return html`<task-review-component
          @close-modal=${this.closeTasks}
        ></task-review-component>`;
      default:
        return ""; // 不显示任何组件
    }
  }

  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }
}

customElements.define("task-management", TaskManagement);
