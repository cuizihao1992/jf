import { LitElement, html, css, unsafeCSS } from 'lit';
import styles from './css/device-list.css?inline';
import api from '@/apis/api';

class DeviceList extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static get properties() {
    return {
      treeData: { type: Array }, // 用于存储设备的树状结构
    };
  }

  constructor() {
    super();
    this.treeData = [];
  }

  async firstUpdated() {
    try {
      const res = await api.devicesApi.getTree();
      this.treeData = res || [];
    } catch (error) {
      console.error('获取设备树状结构失败:', error);
    }
  }

  renderTree(nodes) {
    return html`
      <ul>
        ${nodes.map(
          (node) => html`
            <li>
              <details>
                <summary>${node.label}</summary>
                ${node.children ? this.renderTree(node.children) : ''}
              </details>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    return html`
      <div class="header">设备列表</div>
      <hr />
      <div class="device-category">
        ${this.treeData && this.treeData.length > 0
          ? this.renderTree(this.treeData)
          : html`<p>加载中...</p>`}
      </div>
    `;
  }
}

customElements.define('device-list', DeviceList);
