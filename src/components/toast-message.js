import { LitElement, html, css } from 'lit';

export class ToastMessage extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    .toast {
      padding: 12px 24px;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      margin-bottom: 8px;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
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

  static properties = {
    messages: { type: Array }
  };

  constructor() {
    super();
    this.messages = [];
  }

  showToast(message, type = 'info', duration = 3000) {
    const id = Date.now();
    this.messages = [...this.messages, { id, message, type }];
    
    // 添加 show 类以触发动画
    setTimeout(() => {
      const toast = this.shadowRoot.querySelector(`[data-id="${id}"]`);
      if (toast) {
        toast.classList.add('show');
      }
    }, 10);

    // 设置自动移除
    setTimeout(() => {
      this.messages = this.messages.filter(m => m.id !== id);
    }, duration);
  }

  render() {
    return html`
      ${this.messages.map(msg => html`
        <div class="toast ${msg.type}" data-id="${msg.id}">
          ${msg.message}
        </div>
      `)}
    `;
  }
}

customElements.define('toast-message', ToastMessage);

// 导出全局 showToast 函数
window.showToast = function({ message, type = 'info', duration = 3000 }) {
  let toast = document.querySelector('toast-message');
  if (!toast) {
    toast = document.createElement('toast-message');
    document.body.appendChild(toast);
  }
  toast.showToast(message, type, duration);
}; 