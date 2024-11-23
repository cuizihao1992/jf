import { LitElement, html, css } from 'lit';

export class ToastMessage extends LitElement {
  static properties = {
    message: { type: String },
    type: { type: String }, // 'success', 'error', 'info'
    duration: { type: Number }, // 消息显示时间
  };

  static styles = css`
    :host {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translate(-50%, 0%); /* 居中对齐 */
      z-index: 9999;
      display: block;
      transition: opacity 0.3s ease;
    }

    .toast {
      padding: 16px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .success {
      background-color: #4caf50;
    }

    .error {
      background-color: #f44336;
    }

    .info {
      background-color: #2196f3;
    }
  `;

  constructor() {
    console.log('asdf');
    super();
    this.message = '';
    this.type = 'info';
    this.duration = 3000;
  }

  connectedCallback() {
    super.connectedCallback();
    this._timeout = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  render() {
    return html` <div class="toast ${this.type}">${this.message}</div> `;
  }
}

customElements.define('toast-message', ToastMessage);
