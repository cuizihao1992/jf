import { LitElement, html, css } from 'lit';

class RealtimeImagery extends LitElement {
  static styles = css`
    :host {
      top: 44.1%;
      left: calc(50% + 550px);
      position: fixed;
      display: block;
      width: 490px;
      font-family: "Arial", sans-serif;
      background: linear-gradient(135deg, #003366, #005599);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
      z-index: 2;
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
    .header {
      font-size: 24px;
      font-weight: bold;
      text-align: left;
      padding-bottom: 10px;
    }
    .img-container {
      width: 450px;
      height: 300px;
      border: 1px solid rgba(42, 130, 228, 1);
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
