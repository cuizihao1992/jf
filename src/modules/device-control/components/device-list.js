import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-list.css?inline';

class DeviceList extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  render() {
    return html`
      <div class="header">设备列表</div>
      <hr />
      <div class="device-category">
        <details>
          <summary style="font-size: 18px;">中卫</summary>
          <details>
            <summary>自动角反射器</summary>
            <ul class="online-list">
              <li>
                <details>
                  <summary>在线</summary>
                  <ul class="device-list">
                    <li>101</li>
                    <li>102</li>
                    <li>103</li>
                    <li>104</li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>未在线</summary>
                  <ul></ul>
                </details>
              </li>
            </ul>
          </details>
          <details>
            <summary>有源定标器</summary>
            <ul class="offline-list"></ul>
          </details>
          <details>
            <summary>点光源</summary>
            <ul class="offline-list"></ul>
          </details>
          <details>
            <summary>激光几何定标器</summary>
          </details>
        </details>
      </div>
    `;
  }
}

customElements.define('device-list', DeviceList);
