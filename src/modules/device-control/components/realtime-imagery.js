import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/realtime-imagery.css?inline';

class RealtimeImagery extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <div class="header">
        实时影像<button class="close-button" @click="${this.closeModal}">
          ×
        </button>
        <div class="img-container">
          <img src="https://via.placeholder.com/450x300" alt="实时影像" />
        </div>
      </div>
    `;
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('realtime-imagery', RealtimeImagery);
