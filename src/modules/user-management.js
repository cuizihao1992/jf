import { LitElement, html } from 'lit';
import '../components/custom-button.js'; // Import the reusable button component
import { sharedStyles } from '../components/shared-styles.js'; // 引入共享样式

class UserManagement extends LitElement {
  static styles = [sharedStyles];
  render() {
    return html`
      <custom-button label="用户审核" @button-click=${this.auditUser}></custom-button>
      <custom-button label="用户权限" @button-click=${this.userPermissions}></custom-button>
    `;
  }

  auditUser() {
    console.log('Audit user clicked');
    // Logic for auditing users
  }

  userPermissions() {
    console.log('User permissions clicked');
    // Logic for managing user permissions
  }
}

customElements.define('user-management', UserManagement);
