import { LitElement, html, css } from 'lit';

class CustomButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: 36px;
      margin: 5px 0;
    }

    button {
      background-color: #0b1527; /* Dark background */
      color: #ffffff; /* Bright yellow-green text */
      border: 2px solid #0f63ff; /* Bright blue border */
      border-radius: 5px 0 0 5px; /* Rounded corners on left side */
      padding: 10px 0;
      font-size: 16px;
      font-family: 'Microsoft YaHei', sans-serif;
      writing-mode: vertical-rl; /* Vertical text */
      text-align: center;
      width: 100%;
      cursor: pointer;
      transition:
        background-color 0.3s,
        color 0.3s,
        border-color 0.3s;
      background-image: url('/images/left-btn-bg.png');
      background-size: cover;
      background-position: center;
    }
    button.selected {
      color: #ffeb3b; /* White text on hover */
    }

    button:hover {
      color: #ffeb3b; /* White text on hover */
    }
  `;

  static properties = {
    label: { type: String },
    selected: { type: Boolean }, // 添加一个选中状态属性
  };
  constructor() {
    super();
    this.selected = false; // 初始化未选中状态
  }
  render() {
    return html`
      <button
        class=${this.selected ? 'selected' : ''}
        @click=${this.handleClick}
      >
        ${this.label}
      </button>
    `;
  }

  handleClick() {
    // Emit a custom event when the button is clicked
    this.dispatchEvent(
      new CustomEvent('button-click', {
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('custom-button', CustomButton);
