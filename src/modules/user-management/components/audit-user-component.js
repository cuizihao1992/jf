import { LitElement, html, css } from 'lit';

class AuditUserComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background-color: #f0f0f0;
    }
  `;

  render() {
    return html`<div>这是用户审核组件的内容</div>`;
  }
}

customElements.define('audit-user-component', AuditUserComponent);
