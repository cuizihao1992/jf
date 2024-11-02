import { LitElement, html, css } from "lit";

class AngleDetection extends LitElement {
  static styles = css`
    :host {
      top: 41%;
      left: calc(50% + 550px);
      position: fixed;
      display: block;
      width: 680px;
      font-family: "Arial", sans-serif;
      background: linear-gradient(135deg, #003366, #005599);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
      Z-index: 2;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .header {
      font-size: 1.5em;
      text-align: left;
      margin-bottom: 20px;
    }
    .image-section {
      border: 2px solid white;
      padding: 5px;
      text-align: center;
    }
    .image-title {
      margin-bottom: 5px;
    }
    .result-section {
      grid-column: 1 / span 2;
      background-color: #3a5f8a;
      padding: 10px;
      border-radius: 5px;
      text-align: center;
      font-size: 1.2em;
    }
    .close-button {
      cursor: pointer;
      color: white;
      background: none;
      border: none;
      font-size: 25px;
      font-weight: bold;
      float: right;
    }
  `;

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
          <img src="https://via.placeholder.com/300x200" alt="实时影像">
        </div>
        <div class="image-section">
          <div class="image-title">姿态调整后</div>
          <img src="https://via.placeholder.com/300x200" alt="实时影像">
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

customElements.define("angle-detection", AngleDetection);
