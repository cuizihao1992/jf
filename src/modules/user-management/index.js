import { LitElement, html, css } from "lit";
import "../../components/custom-button.js"; // Import the reusable button component
import { sharedStyles } from "../../components/shared-styles.js"; // 引入共享样式
import "./components/audit-user-component.js";
import "./components/user-permissions-component.js"; // 假设有创建任务组件
import "./components/user-review.js"; // 用户信息组件
import "./components/user-information.js"; // 用户信息组件

class UserManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String },  // 记录选中的按钮
    activeComponent: { type: String }, // 记录当前显示的组件
    isUserReviewOpen: { type: Boolean },
    isUserInformationOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.selectedButton = "";   // 初始状态没有选中按钮
    this.activeComponent = "";  // 初始状态不显示任何组件
    this.isUserReviewOpen = false; // 初始状态用户信息组件不显示
    this.isUserInformationOpen = false; // 初始状态用户信息组件不显示
  }

  render() {
    return html`
      <div class="left-buttons">
        <custom-button
          label="用户审核"
          ?selected=${this.selectedButton === 'auditUser'}
          @button-click=${() => this.setActiveComponent('auditUser')}
        ></custom-button>

        <custom-button
          label="用户权限"
          ?selected=${this.selectedButton === 'userPermissions'}
          @button-click=${() => this.setActiveComponent('userPermissions')}
        ></custom-button>
      </div>

      ${this.renderActiveComponent()}
      <!-- 用户信息弹窗 -->
      ${this.isUserReviewOpen
        ? html`<user-review @close-modal=${this.closeUserReview}></user-review>`
        : ""}
      ${this.isUserInformationOpen
        ? html`<user-information @close-modal=${this.closeUserInformation}></user-information>`
        : ""}
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
      case "auditUser":
        return html`<audit-user-component
          @close-modal=${this.closeTasks}
          @open-user-review=${this.openUserReview}
        ></audit-user-component>`;  // 替换为实际的用户审核组件
      case "userPermissions":
        return html`<user-permissions-component
          @close-modal=${this.closeTasks}
          @open-user-information=${this.openUserInformation}
        ></user-permissions-component>`;  // 替换为实际的用户权限组件
      default:
        return ""; // 不显示任何组件
    }
  }
  closeTasks() {
    this.activeComponent = ""; // 隐藏当前组件
    this.selectedButton = ""; // 清除选中状态
  }
  openUserReview() {
    this.isUserReviewOpen = true;
  }
  closeUserReview() {
    this.isUserReviewOpen = false;
  }
  openUserInformation() {
    this.isUserInformationOpen = true;
  }
  closeUserInformation() {
    this.isUserInformationOpen = false;
  }
}

customElements.define("user-management", UserManagement);
