import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/angle-detection.css?inline';

class AngleDetection extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  render() {
    return html`
      <div class="header">
        角度检测<button class="close-button" @click="${this.closeModal}">
          ×
        </button>
      </div>
      <div class="container">
        <div class="image-section">
          <div class="image-title">姿态调整前</div>
          <img src="https://via.placeholder.com/300x200" alt="实时影像" />
        </div>
        <div class="image-section">
          <div class="image-title">姿态调整后</div>
          <img src="https://via.placeholder.com/300x200" alt="实时影像" />
        </div>
        <div class="result-section">
          检测结果<br />
          水平角 -15.8°，俯仰角 9.8°
        </div>
      </div>
    `;
  }
  closeModal() {
    this.dispatchEvent(new CustomEvent('close-modal'));
  }
}

customElements.define('angle-detection', AngleDetection);
