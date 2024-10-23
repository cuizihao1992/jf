import { LitElement, html, css } from 'lit';

class UserPermissionsComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background-color: #f0f0f0;
    }
  `;

  render() {
    return html`<div>这是用户权限管理组件的内容</div>`;
  }
}

customElements.define('user-permissions-component', UserPermissionsComponent);
