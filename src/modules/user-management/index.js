import { LitElement, html, css } from 'lit';
import '../../components/custom-button.js';
import { sharedStyles } from '../../components/shared-styles.js';
import './components/audit-user-component.js';
import './components/user-permissions-component.js';
import './components/user-view.js';
import './components/user-information.js';

class UserManagement extends LitElement {
  static styles = [sharedStyles];

  static properties = {
    selectedButton: { type: String },
    activeComponent: { type: String },
    isUserViewOpen: { type: Boolean },
    isUserInformationOpen: { type: Boolean },
    userViewMode: { type: String },
    userInformationMode: { type: String },
    userData: { type: Object },
  };

  constructor() {
    super();
    this.selectedButton = '';
    this.activeComponent = '';
    this.isUserViewOpen = false;
    this.isUserInformationOpen = false;
    this.userViewMode = 'view';
    this.userInformationMode = 'view';
    this.userData = {};
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
      <div class="panel">
        ${this.renderActiveComponent()}
        <div style="position:absolute;top:0;left:100%;">
          ${this.isUserViewOpen
            ? html`<user-view
                mode=${this.userViewMode}
                .userData=${this.userData}
                @close-modal=${this.closeUserView}
                @submit=${this.handleUserViewSubmit}
              ></user-view>`
            : ''}
          ${this.isUserInformationOpen
            ? html`<user-information
                mode=${this.userInformationMode}
                .userData=${this.userData}
                @update-success=${this.handleUserInformationUpdateSuccess}
                @close-modal=${this.closeUserInformation}
                @submit=${this.handleUserInformationSubmit}
              ></user-information>`
            : ''}
        </div>
      </div>
    `;
  }

  setActiveComponent(componentName) {
    if (this.selectedButton === componentName) {
      this.clearAllComponents();
    } else {
      this.clearAllComponents();
      this.activeComponent = componentName;
      this.selectedButton = componentName;
    }
  }

  clearAllComponents() {
    this.activeComponent = '';
    this.selectedButton = '';
    this.isUserViewOpen = false;
    this.isUserInformationOpen = false;
    this.userViewMode = 'view';
    this.userInformationMode = 'view';
  }

  renderActiveComponent() {
    switch (this.activeComponent) {
      case 'auditUser':
        return html`<audit-user-component
          @close-modal=${this.closeTasks}
          @open-user-view=${this.openUserView}
        ></audit-user-component>`;
      case 'userPermissions':
        return html`<user-permissions-component
          @close-modal=${this.closeTasks}
          @open-user-information=${this.openUserInformation}
        ></user-permissions-component>`;
      default:
        return '';
    }
  }

  openUserView(e) {
    this.userViewMode = e.detail.mode;
    this.isUserViewOpen = true;
    this.isUserInformationOpen = false;
    this.userData = e.detail.application; // 将用户数据传递到当前组件
  }

  closeUserView() {
    this.isUserViewOpen = false;
  }

  handleUserViewSubmit(e) {
    console.log('User view submitted:', e.detail);
    this.closeUserView();
  }

  openUserInformation(e) {
    this.userInformationMode = e.detail.mode;
    this.isUserInformationOpen = true;
    this.isUserViewOpen = false;
    this.userData = e.detail.user;
  }

  closeUserInformation() {
    this.isUserInformationOpen = false;
  }

  handleUserInformationSubmit(e) {
    console.log('User information submitted:', e.detail);
    this.closeUserInformation();
  }

  closeTasks() {
    this.clearAllComponents();
  }
}

customElements.define('user-management', UserManagement);
