import { LitElement, html, css } from 'lit';
import './components/system-introduction';
import './components/equipment-status';
class SystemHome extends LitElement {
  static styles = css`
    .content {
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
    }
  `;

  render() {
    return html`
      <div class="content">
        <system-introduction></system-introduction>
        <equipment-status></equipment-status>
      </div>
    `;
  }
}

customElements.define('system-home', SystemHome);
