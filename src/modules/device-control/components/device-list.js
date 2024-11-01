import { LitElement, html, css } from "lit";

class DeviceList extends LitElement {
    static styles = css`
    :host {
      display: block;
      font-family: "Arial", sans-serif;
      color: white;
      background: rgba(0, 9, 36, 0.8);
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      width: 250px;
      left: 50%;
      border: 1px solid rgba(42, 130, 228, 1);
    }

    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .device-category {
      margin-top: 10px;
    }
    .device-list {
      list-style-type: disc; /* 使用圆点样式 */
      padding-left: 20px; /* 添加左内边距 */
      color: #58a6ff; /* 更改文字颜色 */
      background-color: rgba(0, 0, 0, 0.1); /* 添加背景色 */
      border-radius: 5px; /* 添加边角圆滑 */
      margin: 5px 0; /* 添加外边距 */

    }
    details {
      margin: 5px 0;
      padding-left: 15px; /* 增加左边距 */
    }

    summary {
      cursor: pointer;
    }

    .online-list,
    .offline-list {
      list-style-type: none;
      padding-left: 20px;
      margin: 5px 0;
    }

    .online-list a,
    .offline-list a {
      color: #58a6ff;
      text-decoration: none;
    }

    .online-list a:hover,
    .offline-list a:hover {
      text-decoration: underline;
    }
    .device-category details > summary {
      margin-bottom: 5px; /* 调整这个值以缩小间距 */
    }
  `;

  render() {
    return html`
      <div class="header">设备列表</div><hr />
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
                  <ul>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
          <details>
            <summary>有源定标器</summary>
            <ul class="offline-list">
            </ul>
          </details>
          <details>
            <summary>点光源</summary>
            <ul class="offline-list">
            </ul>
          </details>
          <details>
            <summary>激光几何定标器</summary>
          </details>
        </details>
      </div>
    `;
  }
}

customElements.define("device-list", DeviceList);