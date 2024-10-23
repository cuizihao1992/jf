import { LitElement, html, css } from 'lit';

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
        <h2>系统首页</h2>
        <p>欢迎来到系统首页。这是系统的主要仪表盘。</p>
      </div>
    `;
  }
}

customElements.define('system-home', SystemHome);
